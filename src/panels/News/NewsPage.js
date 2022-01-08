import React from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader,PanelHeaderButton, CardGrid, Card, Group, ContentCard, UsersStack, Avatar} from '@vkontakte/vkui';
import { Icon28UserAddOutline, Icon20ArrowLeftOutline} from '@vkontakte/icons';

import AppUser from '../../modules/UserDataList';


const NewsPage = ({id, go, fetchedUser}) => {
  let control = AppUser[fetchedUser.id].mapbox.instance;
  control.left_from_map_page();
  console.log(AppUser[fetchedUser.id])

  return(
      <Panel id={id}>
          <PanelHeader 
              left={
                  <PanelHeaderButton onClick={go} data-to="mapbox">
                      <Icon20ArrowLeftOutline />
                  </PanelHeaderButton>
                  }>
                  Новости
          </PanelHeader>
          {/* <Group
          mode="plain"
          header={<Header mode="secondary"><b>21.05.2021:</b> Информация по ЗНАЧКАМ!</Header>}>
          <CardGrid size="l">
            <Card mode="shadow">
              <div style={{ height: 96 }} />
            </Card>
          </CardGrid>
        </Group>
        <Group
          mode="plain"
          header={<Header mode="secondary"><b>19.05.2021:</b> 6710 человек приняли участие в «Майской прогулке» 2021</Header>}>
          <CardGrid size="l">
            <Card mode="shadow">
              <div style={{ height: 96 }} />
            </Card>
          </CardGrid>
        </Group>
        <Group
          mode="plain"
          header={<Header mode="secondary"><b>17.05.2021:</b> «Майская прогулка» 2021 проведена успешно!</Header>}>
          <CardGrid size="l">
            <Card mode="shadow">
              <div style={{ height: 96 }} />
            </Card>
          </CardGrid>
        </Group> */}
        <Group>
            <CardGrid size="l">
              <ContentCard
                onClick={() => {}}
                src="https://www.openbusiness.ru/upload/iblock/3fa/color_africa_money_art_design_currency_688782_pxhere.com.jpg"
                header="21.05.2021: Информация по ЗНАЧКАМ!"
                text="Делаем все, что в наших силах, чтобы ускорить поставку. Просим понять и простить."
                maxHeight={150}
              />
              <ContentCard
                onClick={() => {}}
                src="https://майскаяпрогулка.екатеринбург.рф/media/news/news_90339_image_900x_.jpg"
                header="19.05.2021: 6710 человек приняли участие в «Майской прогулке» 2021"
                text="Цифра — официальная. Это те, кто зарегистрировался и оплатил оргвзнос. Это те, на кого мы рассчитываем, когда планируем количество необходимых ресурсов."
                maxHeight={150}
              />
              <ContentCard
                onClick={() => {}}
                src="https://pp.userapi.com/c837439/v837439399/321f5/n8aGCOVgicY.jpg"
                header="17.05.2021: «Майская прогулка» 2021 проведена успешно!"
                text="Всем участникам «Майской прогулки» 2021 — поздравления с новым преодолением и благодарность! В этом году испытать себя было особенно нелегко, но вы справились."
                maxHeight={150}
              />
            </CardGrid>
          </Group>
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

