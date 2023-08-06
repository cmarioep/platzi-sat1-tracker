import { useEffect, useState, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

import { SatelliteContext } from '../context/SatelliteProvider';

import useSatellite from '../hooks/useSatellite';

import "leaflet/dist/leaflet.css";
import '../styles/components/MapView.scss';

// custom icon for satellite marker
const CustomSatelliteIcon = L.icon({
    iconUrl: 'public/satelliteIcon.svg',
    iconSize: [48, 48],
    iconAnchor: [15, 30],
});


// custom icon for position marker
const CustomPositionIcon = L.icon({
    iconUrl: 'public/position.svg',
    iconSize: [32, 32],
    iconAnchor: [15, 30],
});


export const MapView = () => {
    const { satellitePosition, setSatellitePosition } = useContext(SatelliteContext);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [userPosition, setUserPosition] = useState(null);

    const mapRef = useRef(null);

    const { getSatellitePosition, getUserLocation, predictSatellitePositions } = useSatellite();


    // Obtener la ruta del satélite con la función predictSatellitePositions
    const startTime = new Date();
    const timeStep = 1000 * 60; // 1 minutos
    const numSteps = 40; // Number of steps in 20 minutes (1 minutes intervals)
    const rutaSatelite = predictSatellitePositions(startTime, timeStep, numSteps);

    // Nuevo estado para controlar la división de la ruta
    const [routeSegments, setRouteSegments] = useState([]);

    // Nuevo efecto para dividir la ruta cuando cruza los límites del mapa
    useEffect(() => {
        if (rutaSatelite.length > 1) {
            const updatedSegments = [];
            for (let i = 1; i < rutaSatelite.length; i++) {
                const prevPos = rutaSatelite[i - 1];
                const currPos = rutaSatelite[i];
                const diffLng = Math.abs(currPos.longitude - prevPos.longitude);
                if (diffLng > 180) {
                    // Divide el segmento si cruza los límites del mapa
                    const midpointLng = (currPos.longitude + prevPos.longitude) / 2;
                    const firstSegment = rutaSatelite.slice(0, i);
                    const secondSegment = rutaSatelite.slice(i);
                    const updatedFirstSegment = firstSegment.map((pos) => ({
                        latitude: pos.latitude,
                        longitude: pos.longitude > 0 ? pos.longitude - 360 : pos.longitude,
                    }));
                    const updatedSecondSegment = secondSegment.map((pos) => ({
                        latitude: pos.latitude,
                        longitude: pos.longitude < 0 ? pos.longitude + 360 : pos.longitude,
                    }));
                    updatedSegments.push(updatedFirstSegment, updatedSecondSegment);
                    break;
                }
            }
            // Si no hubo división, muestra la ruta completa
            if (updatedSegments.length === 0) {
                setRouteSegments([rutaSatelite]);
            } else {
                setRouteSegments(updatedSegments);
            }
        }
    }, [rutaSatelite]);



    // Effect to get the satellite position
    useEffect(() => {
        const satellitePosition = getSatellitePosition();
        setSatellitePosition(satellitePosition);
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
    }, [])


    // Effect to set the satellite position and center the map
    useEffect(() => {
        if (satellitePosition) {
            setMapCenter([satellitePosition.latitude, satellitePosition.longitude]);
        }
    }, [satellitePosition])


    // Function to handle the "Focus" button click
    const handleFocusButton = () => {
        if (mapRef.current && satellitePosition) {
            mapRef.current.setView([satellitePosition.latitude, satellitePosition.longitude], 5);
            // Set the map view to the satellite position with a zoom level of 10 (adjust the zoom level as needed)
        }
    }

    return (
        <>
            <MapContainer ref={mapRef} center={mapCenter} zoom={2} scrollWheelZoom={true} minZoom={2} maxZoom={8}>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                />
                {routeSegments.map((segment, index) => (
                    <Polyline key={index} positions={segment.map((pos) => [pos.latitude, pos.longitude])} color="#60bf7e" />
                ))}
                {satellitePosition && (
                    <Marker position={[satellitePosition.latitude, satellitePosition.longitude]} icon={CustomSatelliteIcon}>
                        <Popup>
                            Satellite Position. <br />
                            Latitude: {satellitePosition.latitude} <br />
                            Longitude: {satellitePosition.longitude}
                        </Popup>
                    </Marker>
                )}
                {userPosition && (
                    <Marker position={[userPosition.latitude, userPosition.longitude]} icon={CustomPositionIcon}>
                        <Popup>
                            Your Position. <br />
                            Latitude: {userPosition.latitude} <br />
                            Longitude: {userPosition.longitude}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <button className="btn-focus" onClick={handleFocusButton}>Focus</button>
        </>
    );
};
