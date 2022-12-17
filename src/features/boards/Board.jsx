import React from 'react';
import {
  useGetBoardsQuery,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from './boardsApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import useAuth from '../../hooks/useAuth';
import setArrayIds from '../../utils/setArrayIds';

const Board = ({ boardId }) => {
  const { userId } = useAuth();
  const { board } = useGetBoardsQuery('boardsList', {
    selectFromResult: ({ data, isSuccess, isFetching }) => ({
      board: data?.entities[boardId],
    }),
  });

  const [
    deleteBoard,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteBoardMutation();

  const navigate = useNavigate();

  if (board) {
    let {
      title,
      description,
      admins,
      users,
      startDate,
      endDate,
      private: isPrivate,
    } = board;

    const normalizedUsersIds = setArrayIds(users);
    const normalizedAdminsIds = setArrayIds(admins);
    const isUser = [...normalizedUsersIds, ...normalizedAdminsIds].includes(
      userId
    );

    const adminsElement = admins.map((admin, index) => (
      <p key={index}>{admin.username}</p>
    ));
    const usersElement = users.map((user, index) => (
      <p key={index}>{user.username}</p>
    ));

    const onDeleteBtnClick = async () => {
      await deleteBoard(boardId);
    };
    const onUpdateBtnClick = async () => {
      await updateBoard(boardId);
    };

    const onNavigateBtnClick = () => navigate(`/dash/boards/${boardId}`);

    return (
      <div className="board-item ">
        <div className="board-item__content flex-col">
          <p
            className="board-item__status"
            style={{ color: isPrivate ? '#E9294C' : '#60E92F' }}
          >
            {isPrivate ? 'Private' : 'Public'}
          </p>
          <p className="item__title board-item__title">{title}</p>
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
  } else return null;
};

export default memo(Board);
