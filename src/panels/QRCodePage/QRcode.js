import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';

import GetQRCode from '../../modules/QrCodes/generateQR';

const QRCodePage = ({id, fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader id={id}>
			Testing QR-code
		</PanelHeader>
        <GetQRCode text={"this user in the app"} />
    </Panel>
);

QRCodePage.propTypes = {
	id: PropTypes.string.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default QRCodePage;
