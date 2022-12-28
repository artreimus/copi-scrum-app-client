import React from 'react';
import { useState } from 'react';
import { useAccessBoardMutation } from './boardsApiSlice';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const PrivateBoardAuth = () => {
  const [password, setPassword] = useState('');
  const { id: boardId } = useParams();
  const { userId } = useAuth();

  const [accessBoard, { isSuccess, isLoading, isError, error }] =
    useAccessBoardMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    await accessBoard({ boardId, credentials: { userId, password } });
  };

  return (
    <section className="center-all join-board">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <article className="article--white join-board__article center-all">
        <h2 className="article__about__title">Join Board</h2>
        <p className="join-board__article__text">
          Get ready to take your teamwork to the next level! Submit the password
          to board to join the private scrum board and start sprinting towards
          success!
        </p>
        <form onSubmit={onSubmit} className="join-board__form flex-col ">
          <div className="flex-col ">
            <label htmlFor="password" className="join-board__article__label">
              Password
            </label>
            <input
              className="join-board__article__input"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              placeholder="board password"
              required
            />
          </div>
          <button className="btn--blue join-board__article__btn">Submit</button>
        </form>
      </article>
    </section>
  );
};

export default PrivateBoardAuth;
