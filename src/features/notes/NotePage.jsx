import { useGetNotesQuery } from './notesApiSlice';
import { useParams } from 'react-router-dom';
import { useGetSingleNoteQuery } from './notesApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import UpdateNoteForm from './UpdateNoteForm';

const NotePage = () => {
  const { id: noteId } = useParams();

  const { data, isLoading, isSuccess, isError, error } = useGetSingleNoteQuery(
    noteId,
    'notePage',
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
    const { note } = data;
    let { title, text, users, startDate, endDate, status } = note;

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

    const usersElement = users?.map((user, index) => <p key={index}>{user}</p>);

    return (
      <>
        <div className="board">
          <p>Title:{title}</p>
          <p>Text:{text}</p>
          <p>Status:{status}</p>
          <div>
            <strong>Users:</strong>
            {usersElement}
          </div>
          <p>Start Date:{startDate}</p>
          <p>End Date:{endDate}</p>
        </div>
        <UpdateNoteForm noteId={noteId} note={note} />
      </>
    );
  }
};

export default NotePage;
