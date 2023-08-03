import { Logo } from './Logo';
import { SatelliteInfo } from './SatelliteInfo';

export const NavBar = () => {

    return (

        <nav className="navbar">

            <Logo className="navbar__logo" />

            <ul className='navbar__features'>
                <li className='navbar__features__item'>Enfocar</li>
                <li className='navbar__features__item'>Rastrear</li>
                <li className='navbar__features__item'>Mi estación</li>
            </ul>

            <SatelliteInfo />

        </nav>

    )

}