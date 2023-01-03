import { useNavigate } from 'react-router-dom';
import { useGetSingleUserQuery } from './usersApiSlice';
import useAuth from '../../hooks/useAuth';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import Loader from 'react-spinners/MoonLoader';

const UserProfile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, isSuccess, isLoading, isError, error } =
    useGetSingleUserQuery(userId);

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  const onNavigateBtnClick = () => navigate(`/dash/user/${userId}`);

  if (isError && isErrorOpen)
    return (
      <ErrorModal message={error.data.message} setIsOpen={setIsErrorOpen} />
    );

  if (isLoading)
    return (
      <section className="user-profile ">
        <div className="center-all container--loader">
          <Loader color="#fff" size={130} />
        </div>
      </section>
    );

  if (isSuccess) {
    const { username, email, image } = data.user;

    return (
      <section className="user-profile ">
        <div className="user-profile__main flex-col">
          <div className="flex-col user-profile__container user-profile__container__main--info ">
            {image ? (
              <div className="user-profile__picture--image">
                <img src={image} alt="user image" className="avatar" />
              </div>
            ) : (
              <div className="user-profile__picture--default center-all">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
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

export default UserProfile;
