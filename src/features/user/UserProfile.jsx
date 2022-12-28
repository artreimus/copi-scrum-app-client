import { useNavigate } from 'react-router-dom';
import { useGetSingleUserQuery } from './usersApiSlice';
import { memo } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from '../../hooks/useAuth';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const UserProfile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, isError, error } =
    useGetSingleUserQuery(userId);

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  const onNavigateBtnClick = () => navigate(`/dash/user/${userId}`);

  if (isError && isErrorOpen)
    return (
      <ErrorModal message={error.data.message} setIsOpen={setIsErrorOpen} />
    );

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
