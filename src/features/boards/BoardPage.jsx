import { useGetSingleBoardQuery } from './boardsApiSlice';
import { useParams } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';
import UpdateBoardModal from './UpdateBoardModal';
import UpdateBoardAdminsModal from './UpdateBoardAdminsModal';
import UpdateBoardUsersModal from './UpdateBoardUsersModal';
import NotesList from '../notes/NotesList';

function BoardPage() {
  useTitle('Copi');
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

  if (isSuccess) {
    const { board } = data;
    let { title, description, admins, users, completed, startDate, endDate } =
      board;

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

    return (
      <>
        <div className="board">
          <p>Title:{title}</p>
          <p>Description:{description}</p>
          <p>Completed:{completed?.toString()}</p>
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
        <UpdateBoardModal board={board} boardId={boardId} />
        <UpdateBoardAdminsModal
          boardAdmins={admins}
          boardUsers={users}
          boardId={boardId}
        />
        <UpdateBoardUsersModal
          boardUsers={users}
          boardId={boardId}
          boardAdmins={admins}
        />
        <NotesList boardId={boardId} boardUsers={users} />
      </>
    );
  }
}

export default BoardPage;
