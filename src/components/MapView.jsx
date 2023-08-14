import { useEffect, useState, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

import { SatelliteContext } from '../context/SatelliteProvider';

import useSatellite from '../hooks/useSatellite';

import "leaflet/dist/leaflet.css";
import '../styles/components/MapView.scss';

import SatelliteIcon from '../assets/satelliteIcon.svg'
import PositionIcon from '../assets/position.svg'

// custom icon for satellite marker
const CustomSatelliteIcon = L.icon({
    iconUrl: SatelliteIcon,
    iconSize: [48, 48],
    iconAnchor: [15, 30],
});


// custom icon for position marker
const CustomPositionIcon = L.icon({
    iconUrl: PositionIcon,
    iconSize: [32, 32],
    iconAnchor: [15, 30],
});


export const MapView = () => {
    const { satellitePosition, setSatellitePosition, showSatelliteInfo, setShowSatelliteInfo } = useContext(SatelliteContext);
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
            mapRef.current.setView([satellitePosition.latitude, satellitePosition.longitude], 4);
            // Set the map view to the satellite position with a zoom level of 10 (adjust the zoom level as needed)
        }
    }

    // Function to handle show more button click
    const handleShowSatelliteInfo = () => {
        setShowSatelliteInfo(!showSatelliteInfo);
    }

    return (
        <>
            <MapContainer
                ref={mapRef}
                center={mapCenter}
                zoom={2}
                scrollWheelZoom={true}
                minZoom={2}
                maxZoom={8}
                maxBounds={[
                    [-80, -180], // Southwestern corner
                    [80, 180],   // Northeastern corner
                ]}
            >
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
                            Latitude: {satellitePosition.latitude.toFixed(6)} <br />
                            Longitude: {satellitePosition.longitude.toFixed(6)}
                        </Popup>
                    </Marker>
                )}
                {userPosition && (
                    <Marker position={[userPosition.latitude, userPosition.longitude]} icon={CustomPositionIcon}>
                        <Popup>
                            Your Position. <br />
                            Latitude: {userPosition.latitude.toFixed(6)} <br />
                            Longitude: {userPosition.longitude.toFixed(6)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className="controls">
                <button className="btn" onClick={handleFocusButton}>Focus</button>
                <button className="btn btn-showInfo" onClick={handleShowSatelliteInfo}>{showSatelliteInfo ? 'Show less' : 'Show more'}</button>
            </div>
        </>
    );
};
