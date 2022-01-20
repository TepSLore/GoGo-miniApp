import React, { useRef, useEffect, useState } from 'react';
import { Panel, PanelHeader, ModalCard, SplitLayout, PanelHeaderButton, Header, Button, Group, Cell, Div, Avatar, ActionSheet, ActionSheetItem, ConfigProvider } from '@vkontakte/vkui';
import { Icon28Notifications, Icon20MenuOutline } from "@vkontakte/icons";
import MapboxControl from "../../modules/Mapbox/Mapbox-control";
import {Icon20QrCodeOutline, Icon28Profile, Icon20ArticleBoxOutline, Icon24LocationOutline, Icon24Newsfeed, Icon16CancelCircleOutline, Icon28LocationMapOutline, Icon56MoneyTransferOutline, Icon28AccessibilityOutline } from '@vkontakte/icons';
import all_geojsons from '../../roads/Geojsons';
import GetQRCode from '../../modules/QrCodes/generateQR';
import AppUser from '../../modules/UserDataList';

import './Mapbox.css'

let map_initialised = false;
var mapCont = null;
var control = null;

function MapBox(props) {
    const [popout, setPopout] = useState(null);
    const onClose = () => setPopout(null);
    const iconsTargetRef = useRef();
    const baseTargetRef = useRef();
    let p = props;
    control = AppUser[p.fetchedUser.id].mapbox.instance;
    console.log(control.id);
    mapCont = control.init(p.fetchedUser);
    control.update_user_location(4, true);
    console.log(AppUser[p.fetchedUser.id]);

    const openBase = () => {
        console.log('OpenBase')
        setPopout(
            <ActionSheet
                onClose={onClose}
                className='scroll-pannel'>
                <ActionSheetItem onClick={() => { control.set_kml_layer(all_geojsons.Kalin_shartash) }} autoclose>20 км «Калиновка-Шарташ»</ActionSheetItem>
                <ActionSheetItem onClick={() => { control.set_kml_layer(all_geojsons.Ubileyniy) }} autoclose>32 км «Юбилейный»</ActionSheetItem>
                <ActionSheetItem onClick={() => { control.set_kml_layer(all_geojsons.Autumn_marathon) }} autoclose>42 км «Осенний марафон»</ActionSheetItem>
                <ActionSheetItem autoclose mode="destructive">Закрыть</ActionSheetItem>
            </ActionSheet>
        );
    };

    const OpenInformation = () => {
        console.log(p)
        setPopout(
            <ActionSheet
                onClose={onClose}

                toggleRef={baseTargetRef}
                className='scroll-pannel'>
                <button className='bt_actionSheet' onClick={p.go} data-to="accountPage"><ActionSheetItem before={<Icon28Profile />}>Профиль</ActionSheetItem></button>
                <button className='bt_actionSheet' ><ActionSheetItem autoclose before={<Icon28LocationMapOutline />} getRootRef={baseTargetRef} onClick={openBase}>Маршруты</ActionSheetItem></button>
                <button className='bt_actionSheet' onClick={p.go} data-to="contactPage"><ActionSheetItem autoclose before={<Icon28AccessibilityOutline width={28} height={28} />}>Контакты</ActionSheetItem></button>
                <button className='bt_actionSheet' onClick={p.go} data-to="newsPage"><ActionSheetItem autoclose before={<Icon24Newsfeed width={28} height={28} />}>Новости</ActionSheetItem></button>
                <ActionSheetItem autoclose mode="destructive" before={<Icon16CancelCircleOutline width={28} height={28} />}>Закрыть</ActionSheetItem>
            </ActionSheet>
        );
    };


    const OpenModal = () => {
        console.log("modal")
        setPopout(
            <ActionSheet
                onClose={onClose}
                iosCloseItem={
                    <ActionSheetItem autoclose mode="cancel">
                        Отменить
                    </ActionSheetItem>
                }
                toggleRef={baseTargetRef}
                className='scroll-pannel'>
                <GetQRCode text = {"https://backendnew-timurmikolenko.vercel.app/qr?id=" + p.fetchedUser.id + "&road_id=527105&control_point=1&road_name=Kalininskyi&long=" + control.curUserCoords[0] + "&lat=" + control.curUserCoords[1]}/>
                <ActionSheetItem autoclose mode="destructive" before={<Icon16CancelCircleOutline width={28} height={28} />}>Закрыть</ActionSheetItem>
            </ActionSheet>
        );
    };

    return (
        <SplitLayout popout={popout} id={p.id}>
            <Panel>
                <PanelHeader 
                    left={
                        <PanelHeaderButton getRootRef={iconsTargetRef} onClick={OpenInformation}>
                            <Icon20MenuOutline />
                        </PanelHeaderButton>
                    }>
                    Карта
                </PanelHeader>

                <div>
                    <div id="map" ref={mapCont} className="map-container" >
                        <div className="control-buttons">
                            <Button className='button' getRootRef={baseTargetRef} onClick={openBase}>
                                <Icon20ArticleBoxOutline width={20} height={20} />
                            </Button>
                            <Button disabled={false} className='button' onClick={OpenModal}>
                                <Icon20QrCodeOutline width={20} height={20} />
                            </Button>
                            <Button className='button' onClick={() => { control.set_map_center() }}>
                                <Icon24LocationOutline width={20} height={20} />
                            </Button>                          
                        </div>
                    </div>
                </div>
            </Panel>
        </SplitLayout>
    );
};

export default MapBox;

