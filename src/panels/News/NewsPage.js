import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';

import {Panel, PanelHeader,PanelHeaderButton, CardGrid, Group, ContentCard, PullToRefresh} from '@vkontakte/vkui';
import {Icon20ArrowLeftOutline} from '@vkontakte/icons';

import AppUser from '../../modules/UserDataList';
import ErrorImg from '../../img/ErrorImg.jpg';

function createCard(item){
  let srcImg;

  if(item.meta_value == ""){
    srcImg = ErrorImg;
  } else srcImg = 'https://myprogulkatest.ga/wp-content/uploads/' + item.meta_value;

  return(
    <ContentCard
      onClick={() => { }}
      src={srcImg}
      header={item.post_title}
      text={item.post_content.replace(/(\<(\/?[^>]+)>)/g, '')}
      maxHeight={150}
      key={item.post_id}
    />
  );
};

const NewsPage = ({id, go, fetchedUser}) => {
  const [data, setData] = useState([]);
  let error_post = [{
    "meta_value" : "",
    "post_content" : "Ошибка соединения с сервером",
    "post_id" : 1,
    "post_title" : "ERROR"
  }];
  let state = {
    "data": data,
    "fetching": false
  };
  let control = AppUser[fetchedUser.id].mapbox.instance;

  control.left_from_map_page();

  useEffect(async () => {
    try{
      let response = await fetch("https://backendnew-timurmikolenko.vercel.app:443/post");
      console.log(response.ok)
      if(response.ok){
        let responseJson = await response.json();
        let response_len = Object.keys(responseJson).length;
        console.log(responseJson);

        if(response_len != 0){
          setData(responseJson.posts_data);
        } else setData(error_post);
      } else setData(error_post);
    } catch{
      setData(error_post);
    };
  }, []);

  let onRefresh = () => {
    state.fetching = true;

    setTimeout( async () => {
      try{
        let response = await fetch("https://backendnew-timurmikolenko.vercel.app:443/post");
        console.log(response.ok)
        if(response.ok){
          let responseJson = await response.json();
          let response_len = Object.keys(responseJson).length;
          console.log(responseJson);
  
          if(response_len != 0){
            setData(responseJson.posts_data);
          } else setData(error_post);
        } else setData(error_post);
      } catch{
        setData(error_post);
      };
      
      state.data = data;
      state.fetching = false;
    }, 700);
  };
  
  return (
    <Panel id={id}>
      <PanelHeader
        left={
          <PanelHeaderButton onClick={go} data-to="mapbox">
            <Icon20ArrowLeftOutline />
          </PanelHeaderButton>
        }>
        Новости
      </PanelHeader>

      <PullToRefresh
        onRefresh={onRefresh}
        isFetching={state.fetching}
      >
        <Group>
          <CardGrid size="l">
            {
              data.map(item => (createCard(item))).reverse()
            }
          </CardGrid>
        </Group>
      </PullToRefresh>
    </Panel>
  );
};

NewsPage.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};

export default NewsPage;