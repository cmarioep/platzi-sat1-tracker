import { Logo } from './Logo';

export const NavBar = () => {

    return (
        <nav className="navbar">

            <Logo />

            <ul className='navbar__features'>
                <li className='navbar__features__item'>Enfocar</li>
                <li className='navbar__features__item'>Rastrear</li>
                <li className='navbar__features__item'>Mi estación</li>
            </ul>

        </nav>
    )

}