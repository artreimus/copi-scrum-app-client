import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetSingleUserQuery } from './usersApiSlice';
import { memo } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from '../../hooks/useAuth';

const UserProfile = () => {
  const { userId } = useAuth();

  const { data, isLoading, isSuccess, isError, error } =
    useGetSingleUserQuery(userId);

  const navigate = useNavigate();
  const onNavigateBtnClick = () => navigate(`/dash/user/${userId}`);

  if (isLoading) return <PulseLoader color="#FFF" />;

  if (isSuccess) {
    const { username, email } = data.user;

    return (
      <section className="user-profile ">
        <div className="user-profile__main flex-col">
          <div className="flex-col user-profile__container user-profile__container__main--info ">
            <div className="user-profile__picture center-all">
              {username.charAt(0).toUpperCase()}
            </div>
            <p className="user-profile__username">{username}</p>
          </div>
          <div className="flex-row user-profile__container user-profile__container--info">
            <p className="user-profile__info">
              <strong>Email:</strong>
              {email ?? ''}
            </p>
          </div>
          <div className="flex-row user-profile__container user-profile__container--info">
            <p className="user-profile__info">
              <strong>Password:</strong>
            </p>
          </div>
          <button
            className="btn--blue user-profile__btn"
            onClick={onNavigateBtnClick}
          >
            Update Profile
          </button>
        </div>
      </section>
    );
  }
};

export default memo(UserProfile);
