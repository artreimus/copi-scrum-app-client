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

  if (data) {
    const { username, email } = data.user;

    console.log(data);
    return (
      <div>
        <h1>user page</h1>
        <p>Username: {username}</p> <p>Email: {email ?? ''}</p>
        <button onClick={onNavigateBtnClick}>Edit User Profile</button>
      </div>
    );
  }
};

export default memo(UserProfile);
