import { useState, useContext } from 'react';
import { SatelliteContext } from '../context/SatelliteProvider';

import { Logo } from './Logo';
import { SatelliteInfo } from './SatelliteInfo';

export const NavBar = () => {

    const { showSatelliteInfo, setShowSatelliteInfo } = useContext(SatelliteContext);
    // const [showSatelliteInfo, setShowSatelliteInfo] = useState(false);


    return (
        <nav className="navbar">

            <Logo className="navbar__logo" />
            <SatelliteInfo />

        </nav>
    );
}
