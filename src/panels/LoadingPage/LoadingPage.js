import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';

import "./LoadingPage.css"

const LoadingPage = ({id, go, fetchedUser}) => (
    <Panel id={id}  onClick={go} data-to="mapbox">
		<div className='body'>
			<div className='logo' />
		</div> 
    </Panel>
);

LoadingPage.propTypes = {
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

export default LoadingPage;