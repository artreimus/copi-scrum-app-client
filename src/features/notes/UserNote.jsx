import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserNote = ({ note }) => {
  const navigate = useNavigate();

  let { title, text, status, startDate, endDate, boardId: board, users } = note;

  if (startDate) {
    startDate = formatDate(startDate);
  }

  if (endDate) {
    endDate = formatDate(endDate);
  }

  const navigateToNotePage = () => navigate(`/dash/notes/${note._id}`);

  const usersElement = users?.map((user) =>
    user.image ? (
      <div key={user._id} className="note-item__user--image center-all">
        <img src={user.image} alt="user image" className="avatar" />
      </div>
    ) : (
      <div key={user._id} className="note-item__user--default center-all">
        {user.username.charAt(0)}
      </div>
    )
  );

  return (
    <div className="user-note" onClick={navigateToNotePage}>
      <div className="article__about__grid">
        <p className="article__about__label">Title</p>
        <p>{title}</p>
        <p className="article__about__label">Text</p>
        <p>{text}</p>
        <p className="article__about__label">Board</p>
        <p>{board?.title}</p>
        <p className="article__about__label">Status</p>
        <p>{status}</p>
        <p className="article__about__label">Start Date (Target)</p>
        <p>{startDate ?? 'None'}</p>
        <p className="article__about__label">End Date (Target)</p>
        <p>{endDate ?? 'None'}</p>
        <p className="article__about__label">Assigned users</p>
        <div className="article__about__container--users grid--users">
          {usersElement.length ? usersElement : 'None'}
        </div>
      </div>
      <div className="flex-row"></div>
    </div>
  );
};

export default UserNote;
