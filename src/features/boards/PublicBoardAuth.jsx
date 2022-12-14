import React from 'react';
import { useParams } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import useAuth from '../../hooks/useAuth';
import { useAccessBoardMutation } from './boardsApiSlice';

const PublicBoardAuth = () => {
  const { id: boardId } = useParams();
  const { userId } = useAuth();

  const [accessBoard, { isSuccess, isLoading, isError, error }] =
    useAccessBoardMutation();

  const onBtnClicked = async () => {
    await accessBoard({ boardId, credentials: { userId } });
  };

  if (isLoading) return <PulseLoader color="#FFF" />;

  return (
    <div>
      <button onClick={onBtnClicked}> Join board</button>
    </div>
  );
};

export default PublicBoardAuth;
