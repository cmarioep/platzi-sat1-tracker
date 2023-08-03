import { useContext } from 'react';
import { SatelliteContext } from '../context/SatelliteProvider';

import { CurrentTime } from './CurrentTime';

export const SatelliteInfo = () => {

    const { satellitePosition, setSatellitePosition } = useContext(SatelliteContext);

    return (
        <>
            <CurrentTime />
        </>
    )
    
}