import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import Loader from 'react-spinners/MoonLoader';

const RequirePrivBoard = () => {
  const location = useLocation();
  const { id } = useParams();
  const { data, isSuccess, isLoading } = useGetSingleBoardQuery(id);

  if (isLoading)
    return (
      <div className="center-all container--loader">
        <Loader color="#3861f6" size={130} />
      </div>
    );

  let content = null;

  if (isSuccess) {
    const { private: isPrivate } = data.board;

    content = isPrivate ? (
      <Outlet />
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

export default RequirePrivBoard;
