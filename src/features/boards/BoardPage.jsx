import { useGetSingleBoardQuery } from './boardsApiSlice';
import { useParams } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import UpdateBoardModal from './UpdateBoardModal';
import NewNoteModal from '../notes/NewNoteModal';
import useToggleModal from '../../hooks/useToggleModal';
import BoardPageHeader from './BoardPageHeader';
import BoardPageAbout from './BoardPageAbout';
import BoardPageNotes from './BoardPageNotes';
import formatDate from '../../utils/formatDate';

function BoardPage() {
  useTitle('Copi');
  const [isUpdatedBoardModalOpen, setIsUpdatedBoardModalOpen] =
    useToggleModal();
  const [isNewNoteModalOpen, setIsNewnoteModalOpen] = useToggleModal();

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
  if (isError) return <p>error</p>;

  if (isSuccess) {
    let { title, users, startDate, endDate } = data.board;

    if (startDate) {
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    return (
      <>
        <BoardPageHeader boardId={boardId} />
        <section className="board-page">
          <BoardPageAbout />
          <BoardPageNotes
            boardId={boardId}
            title={title}
            startDate={startDate}
            endDate={endDate}
            boardUsers={users}
            setIsNewnoteModalOpen={setIsNewnoteModalOpen}
          />
        </section>
        {isUpdatedBoardModalOpen && (
          <UpdateBoardModal
            board={board}
            boardId={boardId}
            showBoardModal={isUpdatedBoardModalOpen}
            setIsUpdatedBoardModalOpen={setIsUpdatedBoardModalOpen}
          />
        )}
        <NewNoteModal
          boardUsers={users}
          boardId={boardId}
          showNewNoteModal={isNewNoteModalOpen}
          setNewShowNoteModal={setIsNewnoteModalOpen}
        />
      </>
    );
  }
}

export default BoardPage;
