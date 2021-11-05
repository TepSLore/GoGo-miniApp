import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; 
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVwc2xvcmUiLCJhIjoiY2t2M3B5YzhuNGE4bTJvczcxcHl0OGduZyJ9.Wy0faVduOFtH1QVImTdDVQ';

function MapBox(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(60.68743133544922);
    const [lat, setLat] = useState(56.83428192138672);
    const [zoom, setZoom] = useState(17);

    useEffect(() => {
    if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'https://raw.githubusercontent.com/TepSLore/mapboxStyle/main/mapbox-styles.json',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true, 
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
                auto: true
            })
        );
    });

    useEffect(() => {
    if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });
    
    return (
        <Panel>
            <PanelHeader id={props.id}
			left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
            >
			MapBox
		    </PanelHeader>
            <div>
                <div ref={mapContainer} className="map-container" />
            </div>
	    </Panel>
    );
}

export default MapBox

