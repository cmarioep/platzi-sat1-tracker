import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import useSatellite from '../../hooks/useSatellite';

import "leaflet/dist/leaflet.css";
import '../styles/components/MapView.scss';


export const MapView = () => {

    const [mapCenter, setMapCenter] = React.useState([0, 0]); // Coordenadas para centrar el mapa inicialmente

    const {
        getUserLocation
    } = useSatellite();

    React.useEffect(() => {

        const userLocationPromise = getUserLocation();

        userLocationPromise.then((userLocation) => {
            setMapCenter([userLocation.latitude, userLocation.longitude]);
        });

    }, [mapCenter]);

    return (
        <MapContainer center={mapCenter} zoom={3} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            />
            <Marker position={mapCenter}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );

}