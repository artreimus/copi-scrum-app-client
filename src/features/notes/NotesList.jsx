import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import useAuth from '../../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import NewNoteModal from './NewNoteModal';

const NotesList = ({ boardId, boardUsers }) => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(boardId, {
    // refetch options
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const onAddNoteClicked = () => {};

  let content = null;

  if (isLoading) content = <PulseLoader color={'#FFF'} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = notes;
    const tableContent = ids?.length
      ? ids.map((noteId) => (
          <Note key={noteId} noteId={noteId} boardId={boardId} />
        ))
      : null;

    content = (
      <div>
        {tableContent}
        <NewNoteModal boardUsers={boardUsers} boardId={boardId} />
      </div>
    );
  }

  return content;
};

export default NotesList;
