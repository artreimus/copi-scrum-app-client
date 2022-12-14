import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const RequirePubBoard = () => {
  const location = useLocation();
  const { id } = useParams();
  const { data, isSuccess, isLoading } = useGetSingleBoardQuery(id);

  if (isLoading) return <PulseLoader color="#FFF" />;

  let content = null;
  if (isSuccess) {
    const { private: isPrivate } = data.board;

    content = !isPrivate ? (
      <Outlet />
    ) : (
      <Navigate
        to={`/dash/boards/${id}/join-private`}
        state={{ from: location }}
        replace
      />
    );
  }

  return content;
};

export default RequirePubBoard;
