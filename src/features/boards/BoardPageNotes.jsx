import { useState, useEffect } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import useAuth from '../../hooks/useAuth';
import NotesList from '../notes/NotesList';
import BoardPageHeader from './BoardPageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { useGetSingleBoardQuery } from './boardsApiSlice';
import { useParams } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import authorizeUser from '../../utils/authorizeUser';
import useToggleModal from '../../hooks/useToggleModal';
import NewNoteModal from '../notes/NewNoteModal';
import ErrorModal from '../../components/ErrorModal';
import Loader from 'react-spinners/MoonLoader';

const BoardPageNotes = () => {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const windowSize = useWindowSize();
  const { userId } = useAuth();
  const { id: boardId } = useParams();
  const [isOpen, setIsOpen] = useToggleModal();

  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetSingleBoardQuery(boardId, 'boardPage', {
      // refetch options
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  useEffect(() => {
    const { admins } = data.board;
    if (isSuccess) {
      setIsUserAdmin(
        authorizeUser(
          admins.map((admin) => admin._id),
          userId
        )
      );
    }
  }, [isSuccess, isFetching]);

  if (isLoading)
    return (
      <div className="center-all container--loader">
        <Loader color="#3861f6" size={130} />
      </div>
    );

  if (isError && isErrorOpen)
    return (
      <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
    );

  let content = null;

  if (isSuccess) {
    const { board } = data;
    let { title, admins, users, startDate, endDate } = board;

    if (startDate) {
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    content = (
      <>
        <BoardPageHeader
          boardId={boardId}
          isUserAdmin={isUserAdmin}
          admins={admins}
          users={users}
        />

        <section className="board-page">
          <div className="section__header flex-row">
            <div>
              <h2 className="section__title section__header__title truncate-text">
                {title}
              </h2>
              <p className="board-page__date">
                <span>{startDate ?? 'no date'}</span>-
                <span>{endDate ?? 'no date'}</span>
              </p>
            </div>
            <button
              className="section__header__button btn--blue"
              onClick={() => setIsOpen(true)}
            >
              {windowSize.width > 600 && 'Add Note'}
              <FontAwesomeIcon icon={faNotesMedical} />
            </button>
          </div>
          {isOpen && (
            <NewNoteModal
              boardUsers={[...users, ...admins]}
              boardId={boardId}
              setIsOpen={setIsOpen}
            />
          )}
          <NotesList boardId={boardId} />
        </section>
      </>
    );
  }

  return content;
};

export default BoardPageNotes;
