import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import MapBox from "./panels/MapboxPage/MapBox";
import LoadingPage from './panels/LoadingPage/LoadingPage';
import ContactPage from './panels/Contact/Contact';
import NewsPage from './panels/News/NewsPage';
import AccountPage from './panels/AccountPage/AccountPage'

const App = () => {
	const [activePanel, setActivePanel] = useState('loadingPage');
	const [fetchedUser, setUser] = useState(null);
	const [userFriends, setUserFriend] = useState(null);
	
	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			console.log("User info is requested");
			//const friends = await bridge.send('VKWebAppGetFriends');
			//setUserFriend(friends);
		}
		fetchData();
	}, []);

	function go (e) {
		setActivePanel(e.currentTarget.dataset.to);
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} >
					<LoadingPage id='loadingPage' userFriends={userFriends} fetchedUser={fetchedUser} go={go} />
					<ContactPage id='contactPage' fetchedUser={fetchedUser} go={go} />
					<Home id='home' fetchedUser={fetchedUser} go={go} />
					<MapBox id='mapbox' userFriends={userFriends} fetchedUser={fetchedUser} go={go} />
					<NewsPage id='newsPage' fetchedUser={fetchedUser} go={go} />
					<AccountPage id='accountPage' fetchedUser={fetchedUser} go={go} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
