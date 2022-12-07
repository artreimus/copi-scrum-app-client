import { useGetBoardsQuery } from './boardsApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import Board from './Board';
import NewBoardModal from './NewBoardModal';

const BoardsList = () => {
  useTitle('Copi');
  const {
    data: boards,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetBoardsQuery('boardsList', {
    // refetch options
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content = null;
  if (isLoading) return <PulseLoader color={'#FFF'} />;
  if (isError) return <NewBoardModal />;

  if (isSuccess && !isFetching) {
    const { ids } = boards;

    const tableContent =
      ids?.length &&
      ids.map((boardId) => <Board key={boardId} boardId={boardId} />);

    content = (
      <>
        <div className="boards__list">{tableContent}</div>
        <NewBoardModal />
      </>
    );
  }

  return content;
};

export default BoardsList;
