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
    <section className="center-all join-board">
      <article className="article--white join-board__article center-all">
        <h2 className="article__about__title">Join Board</h2>
        <p className="article__join-board__text ">
          Get ready to take your teamwork to the next level! Press the button to
          join the public scrum board and start sprinting towards success
        </p>
        <button
          onClick={onBtnClicked}
          className="btn--blue join-board__article__btn"
        >
          Join board
        </button>
      </article>
    </section>
  );
};

export default PublicBoardAuth;
