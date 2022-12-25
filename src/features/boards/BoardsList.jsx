import { useGetBoardsQuery } from './boardsApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import Board from './Board';
import NewBoardModal from './NewBoardModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import useWindowSize from '../../hooks/useWindowSize';
import useToggleModal from '../../hooks/useToggleModal';

const BoardsList = () => {
  useTitle('Copi');
  const windowSize = useWindowSize();
  const [isOpen, setIsOpen] = useToggleModal();

  const {
    data: boards,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetBoardsQuery('boardsList', {
    // refetch options
    // pollingInterval: 60000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content = null;
  if (isLoading) return <PulseLoader color={'#FFF'} />;
  if (isError) return <NewBoardModal />;

  if (isSuccess && !isFetching) {
    const { ids } = boards;

    const boardsListItems =
      ids?.length &&
      ids.map((boardId) => <Board key={boardId} boardId={boardId} />);

    content = (
      <>
        <section className="boards-list flex-col ">
          <div className="section__header flex-row">
            <h2 className="section__title section__header__title">Boards</h2>
            <button
              className="section__header__button btn--blue"
              onClick={() => setIsOpen(true)}
            >
              {windowSize.width > 600 && 'Add Board'}
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>
          </div>
          <div className="boards-list__container">{boardsListItems}</div>
          {isOpen && <NewBoardModal setIsOpen={setIsOpen} />}
        </section>
      </>
    );
  }

  return content;
};

export default BoardsList;
