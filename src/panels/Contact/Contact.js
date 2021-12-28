import React from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader,PanelHeaderButton, Cell, Header, Group, Button, CellButton, Avatar} from '@vkontakte/vkui';
import { Icon28UserAddOutline, Icon20ArrowLeftOutline} from '@vkontakte/icons';



const ContactPage = ({id, go, fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader 
            left={
                <PanelHeaderButton onClick={go} data-to="mapbox">
                    <Icon20ArrowLeftOutline />
                </PanelHeaderButton>
                }>
                Контакты
        </PanelHeader>
        <Group
        header={<Header>Запрос в команду</Header>}>
            <Cell mode="selectable" before={<Avatar />}>
                Артур Стамбульцян
            </Cell>
            <Cell mode="selectable" before={<Avatar />}>
                Игорь Федоров
            </Cell>
            <Cell mode="selectable" before={<Avatar />}>
                Михаил Лихачев
            </Cell>
            <CellButton>Добавить в группу</CellButton>
        </Group>
        <Group
        header={<Header>Команда</Header>}>
            
            <CellButton mode="danger">Удалить из команды</CellButton>
        </Group>
    </Panel>
);

ContactPage.propTypes = {
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

export default ContactPage;

