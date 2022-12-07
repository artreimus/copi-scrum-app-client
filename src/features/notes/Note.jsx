import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { memo } from 'react';
import { useDeleteNoteMutation } from './notesApiSlice';

const Note = ({ boardId, noteId }) => {
  const { note } = useGetNotesQuery(boardId, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const [
    deleteBoard,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  if (note) {
    let {
      title,
      text,
      users,
      startDate,
      endDate,
      noteCreator,
      status,
      boardId,
    } = note;

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

    const onNavigateBtnClick = () => navigate(`/dash/notes/${note._id}`);
    const onDeleteBtnClick = async () => {
      await deleteBoard(noteId);
    };

    const usersElement = users?.map((user, index) => <p key={index}>{user}</p>);

    return (
      <div className="board">
        <p>Title:{title}</p>
        <p>text:{text}</p>
        <p>Status:{status}</p>
        <strong>Assigned Users:</strong>
        {usersElement}
        <p>Start Date:{startDate}</p>
        <p>End Date:{endDate}</p>
        <p>Creator: {noteCreator}</p>
        <p>Board Id: {boardId}</p>
        <button onClick={onNavigateBtnClick}>Navigate to Page</button>
        <button onClick={onDeleteBtnClick}>Delete</button>
        {/* <button
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
        </button> */}
      </div>
    );
  } else return null;
};

export default memo(Note);
