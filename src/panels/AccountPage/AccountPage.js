import React from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader,PanelHeaderButton, Gradient, Header, Group, Title, List, Avatar, Cell, Counter} from '@vkontakte/vkui';
import { Icon28UserOutline, Icon20ArrowLeftOutline, Icon28UsersOutline, Icon20DiamondOutline, Icon28WindowCheck} from '@vkontakte/icons';
import AppUser from '../../modules/UserDataList';

const AccountPage = ({id, go, fetchedUser}) => {
  let control = AppUser[fetchedUser.id].mapbox.instance;
  control.map_initiated = false;

  return (
    <Panel id={id}>
        <PanelHeader 
            left={
                <PanelHeaderButton onClick={go} data-to="mapbox">
                    <Icon20ArrowLeftOutline />
                </PanelHeaderButton>
                }>
                Контакты
        </PanelHeader>
        {fetchedUser &&
        <Group>
          <Gradient
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 32,
            }}
          >
            <Avatar src={fetchedUser.photo_200} size={96}/>
            <Title
              style={{ marginBottom: 8, marginTop: 20 }}
              level="2"
              weight="medium">
              {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
            </Title>
          </Gradient>
          <Group mode="plain">
          </Group>
        </Group>}
        <Group header={<Header mode="secondary">Достижения</Header>}>
            <List>
                <Cell before={<Icon20DiamondOutline width={28} height={28} />} indicator={<Counter mode="primary">0</Counter>}>
                    Значки
                </Cell>
                <Cell before={<Icon28WindowCheck />} indicator={<Counter mode="primary">0</Counter>}>
                    Пройденные маршруты
                </Cell>
            </List>
        </Group>
    </Panel>
  );
};

AccountPage.propTypes = {
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

export default AccountPage;

