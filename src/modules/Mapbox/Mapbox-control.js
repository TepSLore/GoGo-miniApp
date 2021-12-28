import mapboxgl from '!mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'

import "../../panels/MapboxPage/Mapbox.css"

mapboxgl.accessToken = 'pk.eyJ1IjoidGVwc2xvcmUiLCJhIjoiY2t2M3B5YzhuNGE4bTJvczcxcHl0OGduZyJ9.Wy0faVduOFtH1QVImTdDVQ';

class MapBoxControl{
    mapContainer = useRef(null);
    map = useRef(null);
    curUserPoint = null;
    curUserCoords = null;
    curRoute = false;
    road_info = {
        "cur_road" : {
            "id" : null,
            "kontrol_points" : []
        },
        "last_road" : {
            "id" : null,
            "kontrol_points" : []
        },
        "remove_layer" : false
    };
    zoom = 18;

    init(){
        useEffect(() => {
            bridge
                .send("VKWebAppGetGeodata")
                .then(data => {
                    if (this.map.current) return; // initialize map only once
                    console.log("map is ready");
                    this.map.current = new mapboxgl.Map({
                        container: this.mapContainer.current,
                        style: 'https://raw.githubusercontent.com/TepSLore/mapboxStyle/main/mapbox-styles.json',
                        center: [data.long, data.lat],
                        zoom: this.zoom
                    });
                    this.curUserCoords = [data.long, data.lat];

                    this.set_user_location(data);
                });
        });
        return this.mapContainer;
    };

    set_user_location(coords){  
        const geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [coords.long, coords.lat]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'User Location'
                }
            }]
        };

        for (const feature of geojson.features) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'user-marker';
            console.log("setting user location", feature.geometry.coordinates)
            // make a marker for each feature and add to the map
            if(this.curUserPoint != null){
                console.log("remove last user point");
                this.curUserPoint.remove();
                this.curUserPoint = null;
            };

            this.curUserPoint = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates);
            this.curUserPoint.addTo(this.map.current);
        };
    };

    update_user_location(update_time, work){
        if(work){
            setTimeout(() => {
                console.log("update user location");
                setInterval(() => {
                    bridge
                    .send("VKWebAppGetGeodata")
                    .then(data => {
                        this.curUserCoords = [data.long, data.lat]
                        this.set_user_location(data);
                    });
                }, update_time * 1000)
            }, 1000); 
        }else{
            return;
        };
          
    }

    set_map_center(){
        this.map.current.flyTo({
            center: this.curUserCoords,
            zoom: this.zoom
        });
    };

    set_kml_layer(road_data){
        const geojson = road_data.data;
        const road_id = road_data.id;

        this.road_info.last_road.id = this.road_info.cur_road.id;
        this.road_info.last_road.kontrol_points = this.road_info.cur_road.kontrol_points;
        this.road_info.cur_road.id = road_id;

        if(road_id != this.road_info.last_road.id && this.road_info.last_road.id != null){
            this.road_info.remove_layer = true;
        } else{
            this.road_info.remove_layer = false;
        };
        
        if(this.road_info.remove_layer){
            this.map.current.removeLayer(this.road_info.last_road.id);
            for(const point of this.road_info.last_road.kontrol_points){
                point.remove();
            };
        };
        
        if(this.road_info.cur_road.id != this.road_info.last_road.id){
            for (const feature of geojson.features) {
                if(feature.geometry.type == "Point")
                {
                    const el = document.createElement('div');
                    if(feature.properties.name == "СТАРТ"){
                        el.className = 'checkpointStart'
                    } else if(feature.properties.name == "ФИНИШ"){
                        el.className = 'checkpointFinish'
                    } else{
                        el.className = 'checkpoints';
                    };
                    // create a HTML element for each feature
    
                    // make a marker for each feature and add to the map
            
                    let point = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates)
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 }) // add popups
                            .setHTML(
                                `<h3>${feature.properties.name}</h3>`
                            )
                        );
                    point.addTo(this.map.current);
                    this.road_info.cur_road.kontrol_points.push(point);
                } else if(feature.geometry.type == "LineString"){
                    if(this.map.current.getSource(road_id) == null){
                        this.map.current.addSource(road_id, {
                            'type': 'geojson',
                            'data': feature
                        });
                    };

                    this.map.current.addLayer({
                            'id': road_id,
                            'type': 'line',
                            'source': road_id,
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            'paint': {
                                'line-color': '#888',
                                'line-width': 8
                            }
                    });
                };
            };
        };
    };
};

export default MapBoxControl;