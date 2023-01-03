import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { memo } from 'react';
import formatDate from '../../utils/formatDate';
import Loader from 'react-spinners/RingLoader';

const Note = ({ boardId, noteId }) => {
  const navigate = useNavigate();
  const { note, isSuccess, isLoading } = useGetNotesQuery(boardId, {
    selectFromResult: ({ data, isSuccess, isLoading }) => ({
      note: data?.entities[noteId],
      isSuccess,
      isLoading,
    }),
  });

  if (isLoading)
    return (
      <div className="center-all note_container--loader">
        <Loader color="#3861f6" size={50} />
      </div>
    );

  let content = null;

  if (isSuccess) {
    let { title, text, users, startDate, endDate } = note;

    if (startDate) {
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    const navigateToNotePage = () => navigate(`/dash/notes/${note._id}`);

    const usersElement = users?.slice(0, 4).map((user, index) => {
      console.log(user);
      return (
        <div key={user._id} className="note-item__user center-all">
          {user.image ? (
            <img src={user.image} alt="user image" className="avatar" />
          ) : (
            user.username.charAt(0)
          )}
        </div>
      );
    });

    content = (
      <li className="note-item" onClick={navigateToNotePage}>
        <div className="note-item__content">
          <p className="item__title truncate-text note-item__title">{title}</p>

          <p className="item__text note-item__text">{text}</p>

          <div className="note-item__container--grid">
            <p className="note-item__date item__text">
              {startDate && <span>{`${startDate} - `}</span>}
              <span>{endDate ?? ''}</span>
            </p>
            <div className="note-item__container--users">{usersElement}</div>
          </div>
        </div>
      </li>
    );
  }

  return content;
};

export default memo(Note);
