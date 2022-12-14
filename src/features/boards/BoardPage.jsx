import { useGetSingleBoardQuery } from './boardsApiSlice';
import { useParams } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';
import UpdateBoardModal from './UpdateBoardModal';
import UpdateBoardAdminsModal from './UpdateBoardAdminsModal';
import UpdateBoardUsersModal from './UpdateBoardUsersModal';
import NotesList from '../notes/NotesList';
import NewNoteModal from '../notes/NewNoteModal';
import { useState } from 'react';
import authorizeUser from '../../utils/authorizeUser';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

function BoardPage() {
  useTitle('Copi');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showNewNoteModal, setNewShowNoteModal] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { userId } = useAuth();

  const { id: boardId } = useParams();
  const { data, isLoading, isSuccess, isError, error } = useGetSingleBoardQuery(
    boardId,
    'boardPage',
    {
      // refetch options
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  if (isError) return <p className="errMsg">{error?.data?.message}</p>;

  useEffect(() => {
    const { admins } = data.board;
    if (isSuccess)
      setIsUserAdmin(
        authorizeUser(
          admins.map((admin) => admin._id),
          userId
        )
      );
  }, [isSuccess]);

  if (isSuccess) {
    const { board } = data;
    let {
      title,
      description,
      admins,
      users,
      startDate,
      endDate,
      private: isPrivate,
    } = board;

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

    const adminsElement = admins?.map((admin, index) => (
      <p key={index}>{admin.username}</p>
    ));
    const usersElement = users?.map((user, index) => (
      <p key={index}>{user.username}</p>
    ));

    const onEditBoardBtnClicked = () => {
      setShowBoardModal(true);
    };

    const onEditAdminsBtnClicked = () => {
      setShowAdminModal(true);
    };

    const onEditUsersBtnclicked = () => {
      setShowUserModal(true);
    };

    const onAddNoteBtnclicked = () => {
      setNewShowNoteModal(true);
    };

    return (
      <>
        <div className="board">
          <p>Title:{title}</p>
          <p>Description:{description}</p>
          <p>Private: {isPrivate.toString()}</p>
          <div>
            <strong>Admins:</strong>
            {adminsElement}
          </div>
          <div>
            <strong>Users:</strong>
            {usersElement}
          </div>
          <p>Start Date:{startDate}</p>
          <p>End Date:{endDate}</p>
        </div>
        <div>
          {isUserAdmin && (
            <>
              <button onClick={onEditBoardBtnClicked}>Edit Board</button>
              <button onClick={onEditAdminsBtnClicked}>
                Edit Board Admins
              </button>
              <button onClick={onEditUsersBtnclicked}>Edit Board Users</button>
            </>
          )}
          <button onClick={onAddNoteBtnclicked}>Create New Note </button>
        </div>
        {showBoardModal && (
          <UpdateBoardModal
            board={board}
            boardId={boardId}
            showBoardModal={showBoardModal}
            setShowBoardModal={setShowBoardModal}
          />
        )}
        {showAdminModal && (
          <UpdateBoardAdminsModal
            boardAdmins={admins}
            boardUsers={users}
            boardId={boardId}
            showAdminModal={showAdminModal}
            setShowAdminModal={setShowAdminModal}
          />
        )}
        {showUserModal && (
          <UpdateBoardUsersModal
            boardUsers={users}
            boardId={boardId}
            boardAdmins={admins}
            showUserModal={showUserModal}
            setShowUserModal={setShowUserModal}
          />
        )}
        <NotesList boardId={boardId} boardUsers={users} />
        <NewNoteModal
          boardUsers={users}
          boardId={boardId}
          showNewNoteModal={showNewNoteModal}
          setNewShowNoteModal={setNewShowNoteModal}
        />
      </>
    );
  }
}

export default BoardPage;
