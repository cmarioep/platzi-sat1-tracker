import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import "leaflet/dist/leaflet.css";


export const MapView = () => {

    const mapCenter = [0, 0]; // Coordenadas para centrar el mapa inicialmente

    return (
        <MapContainer center={mapCenter} zoom={3} style={{ height: '400px', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapCenter}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );

}