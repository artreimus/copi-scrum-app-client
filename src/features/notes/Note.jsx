import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { memo } from 'react';
import { useDeleteNoteMutation } from './notesApiSlice';
import formatDate from '../../utils/formatDate';

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
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    const navigateToNotePage = () => navigate(`/dash/notes/${note._id}`);

    const usersElement = users?.map((user, index) => (
      <p key={user._id} className="profile-tab__menu__btn center-all">
        {user.username.charAt(0)}
      </p>
    ));

    return (
      <div className="note-item" onClick={navigateToNotePage}>
        <div className="note-item__content">
          <p className="item__title truncate-text note-item__title">{title}</p>
          <div>
            <p className="item__text note-item__text">{text}</p>
          </div>
          <div className="note-item__container--grid">
            <p className="note-item__date item__text">
              {startDate && <span>{`${startDate} - `}</span>}
              <span>{endDate ?? ''}</span>
            </p>
            <div className="note-item__container--users">{usersElement}</div>
          </div>
        </div>
      </div>
    );
  } else return null;
};

export default memo(Note);
