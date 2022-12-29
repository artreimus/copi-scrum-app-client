import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import Loader from 'react-spinners/MoonLoader';
import setArrayIds from '../../utils/setArrayIds';

const RequireBoardAuth = () => {
  const location = useLocation();
  const { userId } = useAuth();
  const { id } = useParams();

  const { data, isLoading, isSuccess } = useGetSingleBoardQuery(id);

  if (isLoading)
    return (
      <div className="center-all container--loader">
        <Loader color="#3861f6" size={130} />
      </div>
    );

  let content = null;

  if (isSuccess) {
    const { admins, users, private: isPrivate } = data.board;
    const normalizedAdmins = setArrayIds(admins);
    const normalizedUsers = setArrayIds(users);

    content =
      normalizedAdmins.includes(userId) || normalizedUsers.includes(userId) ? (
        <Outlet />
      ) : isPrivate ? (
        <Navigate
          to={`/dash/boards/${id}/join-private`}
          state={{ from: location }}
          replace
        />
      ) : (
        <Navigate
          to={`/dash/boards/${id}/join-public`}
          state={{ from: location }}
          replace
        />
      );
  }

  return content;
};

export default RequireBoardAuth;
