import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../img/logo-sm.png';
import ProfileNav from './ProfileNav';
import useWindowSize from '../hooks/useWindowSize';

const DashHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const windowSize = useWindowSize();

  const onToggleNavBtnclicked = () => setIsOpen((prevIsOpen) => !prevIsOpen);
  const setNavClass = () => {
    return isOpen ? 'dash-header__nav' : 'dash-header__nav hidden';
  };

  return (
    <>
      <div
        className={
          isOpen && windowSize.width <= 1000 ? 'menu-bg' : 'menu-bg hidden'
        }
        onClick={() => setIsOpen(false)}
      ></div>
      <header className="flex-row dash-header">
        <button
          className="dash-header__btn--nav"
          onClick={() => onToggleNavBtnclicked()}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <nav className={setNavClass()}>
          <NavLink
            to="/dash/notes"
            style={({ isActive }) => ({
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#888888' : '#d2d2d2',
              marginBottom: windowSize.width >= 1000 ? 0 : '0.7rem',
            })}
          >
            My Notes
          </NavLink>
          <NavLink
            to="/dash/boards"
            style={({ isActive }) => ({
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#888888' : '#d2d2d2',
              marginLeft: windowSize.width >= 1000 ? '2rem' : 0,
            })}
          >
            Boards
          </NavLink>
        </nav>
        <Link to="/dash" className="center-all auth-header__link">
          <div className="container__image auth-header__container--logo">
            <img src={logoImage} alt="Copi logo" />
          </div>
        </Link>
        <ProfileNav />
      </header>
    </>
  );
};

export default DashHeader;
