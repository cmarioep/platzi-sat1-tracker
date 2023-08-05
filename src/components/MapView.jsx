import { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { SatelliteContext } from '../context/SatelliteProvider';

import useSatellite from '../hooks/useSatellite';

import "leaflet/dist/leaflet.css";
import '../styles/components/MapView.scss';


export const MapView = () => {

    const [mapCenter, setMapCenter] = useState([0, 0]);
    const { satellitePosition, setSatellitePosition } = useContext(SatelliteContext);
    // const [satellitePosition, setSatellitePosition] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const { getSatRec, getSatelliteInfo, convertECItoLatLong, getUserLocation } = useSatellite();

    // Effect to get the satellite position
    useEffect(() => {
        const satRec = getSatRec();
        const currentDate = new Date();
        const positionAndVelocity = getSatelliteInfo(satRec, currentDate);
        const position = convertECItoLatLong(positionAndVelocity.position);
        setSatellitePosition(position);
    }, []);

    // Effect to get the user position
    useEffect(() => {
        const userLocationPromise = getUserLocation();
        userLocationPromise
            .then((userLocation) => {
                setUserPosition(userLocation);
            })
            .catch((error) => {
                console.error('Error getting user location:', error.message);
            });
    }, []);

    useEffect(() => {
        if (satellitePosition) {
            setMapCenter([satellitePosition.latitude, satellitePosition.longitude]);
        }
    }, []);

    return (
        <>
            <MapContainer center={mapCenter} zoom={2} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                />
                {satellitePosition && (
                    <Marker position={[satellitePosition.latitude, satellitePosition.longitude]}>
                        <Popup>
                            Satellite Position. <br />
                            Latitude: {satellitePosition.latitude} <br />
                            Longitude: {satellitePosition.longitude}
                        </Popup>
                    </Marker>
                )}
                {userPosition && (
                    <Marker position={[userPosition.latitude, userPosition.longitude]}>
                        <Popup>
                            Your Position. <br />
                            Latitude: {userPosition.latitude} <br />
                            Longitude: {userPosition.longitude}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <button className="btn-focus">Focus</button>
        </>
    );
};
