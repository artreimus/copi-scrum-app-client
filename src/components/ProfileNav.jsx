import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import ErrorModal from './ErrorModal';
import useToggleModal from '../hooks/useToggleModal';

const ProfileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userId, username } = useAuth();

  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError }] =
    useSendLogoutMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess]);

  const toggleMenu = () => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);

  const onLogoutClicked = () => {
    if (!isLoading) {
      sendLogout();
    }
  };

  return (
    <>
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <div
        className={isMenuOpen ? 'menu-bg' : 'menu-bg hidden'}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className="profile-tab center-all">
        <button className="profile-tab__menu__btn" onClick={toggleMenu}>
          {username.charAt(0).toUpperCase()}
        </button>
        <div
          className={
            isMenuOpen
              ? 'profile-tab__menu flex-col'
              : 'profile-tab__menu flex-col hidden'
          }
        >
          <ul className="profile-tab__menu__list flex-col">
            <li className="profile-tab__menu__item">
              <Link to="/dash/user" className="link">
                Profile
              </Link>
            </li>
            <li className="profile-tab__menu__item">
              <Link to={`/dash/user/${userId}`} className="link">
                Update Profile
              </Link>
            </li>
            <li className="profile-tab__menu__item" onClick={onLogoutClicked}>
              Logout
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileNav;
