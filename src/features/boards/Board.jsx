import React from 'react';
import { useGetBoardsQuery } from './boardsApiSlice';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import useAuth from '../../hooks/useAuth';
import setArrayIds from '../../utils/setArrayIds';

const Board = ({ boardId }) => {
  const { userId } = useAuth();
  const { board, isSuccess } = useGetBoardsQuery('boardsList', {
    selectFromResult: ({ data, isSuccess }) => ({
      board: data?.entities[boardId],
      isSuccess,
    }),
  });

  const navigate = useNavigate();
  let content = null;

  if (isSuccess) {
    let { title, description, admins, users, private: isPrivate } = board;

    const normalizedUsersIds = setArrayIds(users);
    const normalizedAdminsIds = setArrayIds(admins);
    const isUser = [...normalizedUsersIds, ...normalizedAdminsIds].includes(
      userId
    );

    const onNavigateBtnClick = () => navigate(`/dash/boards/${boardId}`);

    content = (
      <div className="board-item ">
        <div className="board-item__content flex-col">
          <p
            className="board-item__status"
            style={{ color: isPrivate ? '#E9294C' : '#60E92F' }}
          >
            {isPrivate ? 'Private' : 'Public'}
          </p>
          <p className="item__title board-item__title truncate-text">{title}</p>
          <p className="item__text board-item__text">{description}</p>

          <button
            className="board-item__button"
            onClick={onNavigateBtnClick}
            style={{ backgroundColor: isUser ? '#0AE4AF' : '#2F5DFF' }}
          >
            {isUser ? 'Access' : 'Join'}
          </button>
        </div>
      </div>
    );
  }
  return content;
};

export default memo(Board);
