import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import useAuth from '../../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import NewNoteModal from './NewNoteModal';
import { useState } from 'react';
import { useEffect } from 'react';

const NotesList = ({ boardId, boardUsers }) => {
  const [showNewNoteModal, setNewShowNoteModal] = useState(false);

  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetNotesQuery(boardId, {
      // refetch options
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });
  console.log('isFetching', isFetching);
  console.log('isLoading', isLoading);

  const onAddNoteBtnclicked = () => {
    setNewShowNoteModal(true);
  };

  let content = null;

  if (isLoading) content = <PulseLoader color={'#FFF'} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = data;
    console.log(ids);
    const tableContent = ids?.length
      ? ids.map((noteId) => (
          <Note key={noteId} noteId={noteId} boardId={boardId} />
        ))
      : null;

    content = (
      <>
        <button onClick={onAddNoteBtnclicked}>Create New Note </button>;
        <div>{tableContent}</div>;
        <NewNoteModal
          boardUsers={boardUsers}
          boardId={boardId}
          showNewNoteModal={showNewNoteModal}
          setNewShowNoteModal={setNewShowNoteModal}
        />
      </>
    );
  }

  return content;
};

export default NotesList;
