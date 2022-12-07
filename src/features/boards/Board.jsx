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

const Board = ({ boardId }) => {
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
    let { title, description, admins, users, startDate, endDate } = board;

    if (startDate) {
      startDate = new Date(startDate).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
      });
    }

    if (endDate) {
      endDate = new Date(endDate).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
      });
    }

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
      <div className="board">
        <p>Title:{title}</p>
        <p>Description:{description}</p>
        <strong>Admins:</strong>
        {adminsElement}
        <strong>Users:</strong>
        {usersElement}
        <p>Start Date:{startDate}</p>
        <p>End Date:{endDate}</p>
        <button
          className="icon-button table__button"
          onClick={onNavigateBtnClick}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          className="icon-button table__button"
          onClick={onDeleteBtnClick}
        >
          DELETE
        </button>
      </div>
    );
  } else return null;
};

export default memo(Board);
