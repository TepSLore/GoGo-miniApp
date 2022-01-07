import React, { useState, useEffect, useRef } from 'react';
import AppUser from '../../modules/UserDataList';
import MapBoxControl from '../../modules/Mapbox/Mapbox-control';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';

import "./LoadingPage.css"


let instance_initiated = false;
let control = null;

function LoadingPage({id, go, fetchedUser, userFriends}) {
	if(!instance_initiated){
		control = new MapBoxControl();
	}
	else{
		useRef();
        useRef();
	}

	setTimeout(() => {
		if(Object.keys(AppUser).includes(String(fetchedUser.id))){
			console.log("Обновляю существующего пользователя");
			AppUser[fetchedUser.id].active = true;
			
		} else{
			console.log("Добавляю нового пользователя");
			AppUser[fetchedUser.id] = {
											"active" : true,
											"position" : [null, null],
											"road" : null,
											"mapbox" : { 
												"instance" : control
											},
											"siteID" : 159648
										};
		};
	}, 1000);

	return(
		<Panel id={id}  onClick={go} data-to="mapbox">
			<div className='body'>
				<div className='logo' />
			</div> 
		</Panel>
	);
};


export default LoadingPage;