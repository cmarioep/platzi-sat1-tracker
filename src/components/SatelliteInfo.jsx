import { useEffect, useContext } from 'react';

import { SatelliteContext } from '../context/SatelliteProvider';

import useSatellite from '../hooks/useSatellite';
import { useCurrentTime } from '../hooks/useCurrentTime';

import { CurrentTime } from './CurrentTime';


export const SatelliteInfo = () => {
    const { satellitePosition, setSatellitePosition } = useContext(SatelliteContext);
    const { getSatellitePosition, getUserLocation } = useSatellite();

    const currentTime = useCurrentTime();

    // Effect to get the satellite position
    useEffect(() => {
        const satellitePosition = getSatellitePosition();
        setSatellitePosition(satellitePosition);
    }, [currentTime])

    return (
        <>
            <CurrentTime />

            <div>
                {satellitePosition && (<p><span>Lat: </span>{satellitePosition.latitude.toFixed(6)}</p>)}
                {satellitePosition && (<p><span>Long: </span>{satellitePosition.longitude.toFixed(6)}</p>)}
            </div>
        </>
    )
}
