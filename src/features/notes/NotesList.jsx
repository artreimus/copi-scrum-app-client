import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import PulseLoader from 'react-spinners/PulseLoader';
import NotesListDropdown from './NotesListDropdown';

const NotesList = ({ boardId, boardUsers }) => {
  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetNotesQuery(boardId, {
      // refetch options
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  let content = null;

  if (isLoading) content = <PulseLoader color={'#FFF'} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = data;

    const toDos = [];
    const inProgress = [];
    const testing = [];
    const done = [];

    ids?.forEach((noteId) => {
      const note = entities[noteId];

      const NoteElement = (
        <Note key={note._id} noteId={note._id} boardId={boardId} />
      );

      switch (note.status) {
        case 'To do':
          toDos.push(NoteElement);
          break;
        case 'In Progress':
          inProgress.push(NoteElement);
          break;
        case 'Testing':
          testing.push(NoteElement);
          break;
        case 'Done':
          done.push(NoteElement);
          break;
        default:
          console.error('Invalid note status');
      }
    });

    console.log(toDos);

    content = (
      <>
        <div className="notes-list">
          <NotesListDropdown title={'To Do'}>{toDos}</NotesListDropdown>
          <NotesListDropdown title={'In Progress'}>
            {inProgress}
          </NotesListDropdown>
          <NotesListDropdown title={'Testing'}>{testing}</NotesListDropdown>
          <NotesListDropdown title={'Done'}>{done}</NotesListDropdown>
        </div>
      </>
    );
  }

  return content;
};

export default NotesList;
