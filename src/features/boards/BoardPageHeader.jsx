import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import UpdateBoardAdminsModal from './UpdateBoardAdminsModal';
import UpdateBoardUsersModal from './UpdateBoardUsersModal';
import useToggleModal from '../../hooks/useToggleModal';
import LeaveBoardModal from './LeaveBoardModal';

const URL_ABOUT_REGEX = /about/;

const BoardPageHeader = ({ isUserAdmin, boardId, admins, users }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useToggleModal();
  const [isUserModalOpen, setIsUserModalOpen] = useToggleModal();
  const [isLeaveBoardModalOpen, setIsLeaveBoardModalOpen] = useToggleModal();

  const location = useLocation();

  return (
    <>
      <nav className="board-page__nav">
        <div className="board-page__nav__container--links">
          <NavLink
            to={`/dash/boards/${boardId}/about`}
            style={({ isActive }) => ({
              fontWeight: 600,
              color: '#000',
              borderBottom:
                isActive && URL_ABOUT_REGEX.test(location.pathname)
                  ? '2px solid #3861f6'
                  : 'none',
            })}
          >
            About
          </NavLink>
          <NavLink
            to={`/dash/boards/${boardId}`}
            style={({ isActive }) => ({
              fontWeight: 600,
              color: '#000',
              marginLeft: '1rem',
              borderBottom:
                isActive && !URL_ABOUT_REGEX.test(location.pathname)
                  ? '2px solid #3861f6'
                  : 'none',
            })}
          >
            Notes
          </NavLink>
        </div>
        {isUserAdmin && (
          <div className="board-page__nav__container--btns">
            <button
              className="btn--blue board-page__nav__btn"
              onClick={() => setIsAdminModalOpen(true)}
            >
              Admins
            </button>
            <button
              className="btn--blue board-page__nav__btn"
              onClick={() => setIsUserModalOpen(true)}
            >
              Users
            </button>
          </div>
        )}
        {!isUserAdmin && (
          <div className="board-page__nav__container--btns">
            <button
              className="btn--red board-page__nav__btn"
              onClick={() => setIsLeaveBoardModalOpen(true)}
            >
              Leave Board
            </button>
          </div>
        )}
      </nav>
      {isAdminModalOpen && (
        <UpdateBoardAdminsModal
          boardAdmins={admins}
          boardUsers={users}
          boardId={boardId}
          setIsOpen={setIsAdminModalOpen}
        />
      )}
      {isUserModalOpen && (
        <UpdateBoardUsersModal
          boardUsers={users}
          boardId={boardId}
          boardAdmins={admins}
          setIsOpen={setIsUserModalOpen}
        />
      )}
      {isLeaveBoardModalOpen && (
        <LeaveBoardModal
          boardUsers={users}
          boardId={boardId}
          setIsOpen={setIsLeaveBoardModalOpen}
        />
      )}
    </>
  );
};

export default BoardPageHeader;
