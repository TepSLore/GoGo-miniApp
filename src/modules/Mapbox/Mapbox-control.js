import mapboxgl from '!mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'

import "../../panels/MapboxPage/Mapbox.css"
import AppUser from '../UserDataList';

import { Marker } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVwc2xvcmUiLCJhIjoiY2t2M3B5YzhuNGE4bTJvczcxcHl0OGduZyJ9.Wy0faVduOFtH1QVImTdDVQ';


class MapBoxControl{
    mapContainer = useRef(null);
    map = useRef(null);

    curUserCoords = null;
    curUserPoint = null;
    userData = null

    geoposition_updating_enabled = false;
    map_initiated = false;
    curRoute = false;

    road_info = {
        "cur_road" : {
            "id" : null,
            "kontrol_points" : []
        },
        "last_road" : {
            "id" : null,
            "kontrol_points" : []
        }
    };

    zoom = 18;
    id = Math.random() * (10000 - 1000) + 1000;

    init(user){
        useEffect(() => {
            if(this.map_initiated) return;
            else{
                this.userData = user;
                console.log("Создаю карту")
                bridge
                    .send("VKWebAppGetGeodata")
                    .then(data => {
                        console.log("map is ready");
                        this.map.current = new mapboxgl.Map({
                            container: this.mapContainer.current,
                            style: 'https://raw.githubusercontent.com/TepSLore/mapboxStyle/main/mapbox-styles.json',
                            center: [data.long, data.lat],
                            zoom: this.zoom
                        });
                        this.curUserCoords = [data.long, data.lat];
                        AppUser[this.userData.id].position = this.curUserCoords;
                        this.set_user_location(data);
                        this.map_initiated = true;
                        setTimeout(() => {
                            this.set_kml_layer(AppUser[this.userData.id].road);
                        }, 1000);
                    });
            };
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
            let photo = this.userData.photo_200;
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.innerHTML = "<img src=\""+photo+"\" class=\"user-image\"/>"
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
        if(work && !this.geoposition_updating_enabled){
            this.geoposition_updating_enabled = true;
            setTimeout(() => {
                setInterval(() => {
                    if(this.map_initiated){
                        console.log("Update user location");
                        bridge
                            .send("VKWebAppGetGeodata")
                            .then(data => {
                                this.curUserCoords = [data.long, data.lat];
                                AppUser[this.userData.id].position = this.curUserCoords;
                                this.set_user_location(data);
                            });
                    };
                }, update_time * 1000)
            }, 1000); 
        }else return;    
    }

    set_map_center(){
        this.map.current.flyTo({
            center: this.curUserCoords,
            zoom: this.zoom
        });
    };

    set_kml_layer(road_data){
        if(road_data == null) return;

        const geojson = road_data.data;
        const road_id = road_data.id;

        this.road_info.last_road.id = this.road_info.cur_road.id;
        this.road_info.last_road.kontrol_points = this.road_info.cur_road.kontrol_points;
        this.road_info.cur_road.id = road_id;

        if(road_id != this.road_info.last_road.id){
            if(this.road_info.last_road.id != null){
                this.remove_road();  
            };
            AppUser[this.userData.id].road = road_data;
            this.add_road(geojson, road_id);
            console.log(this.road_info)

        } else if(road_id == this.road_info.last_road.id && this.road_info.last_road.id != null){
            this.remove_road();
            this.road_info.last_road.kontrol_points = [];
            this.road_info.last_road.id = null;
            this.road_info.cur_road.kontrol_points = [];
            this.road_info.cur_road.id = null;
            AppUser[this.userData.id].road = null;
        };
        console.log(this.road_info);
    };
    
    remove_road(){
        this.map.current.removeLayer(this.road_info.last_road.id);
        for(const point of this.road_info.last_road.kontrol_points){
            point.remove();
        };
    };

    add_road(geojson, road_id){
        this.road_info.cur_road.kontrol_points = [];
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

    left_from_map_page(){
        this.map_initiated = false;
        this.road_info.last_road.kontrol_points = [];
        this.road_info.last_road.id = null;
        this.road_info.cur_road.kontrol_points = [];
        this.road_info.cur_road.id = null;
    };
};

export default MapBoxControl;