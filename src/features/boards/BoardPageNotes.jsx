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

  useEffect(() => {
    let { admins } = data.board;
    if (isSuccess) {
      setIsUserAdmin(
        authorizeUser(
          admins.map((admin) => admin._id),
          userId
        )
      );
    }
  }, [isSuccess, isFetching]);

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  if (isError) return <p>error</p>;

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

    console.log(users);

    content = (
      <>
        <BoardPageHeader
          boardId={boardId}
          isUserAdmin={isUserAdmin}
          admins={admins}
          users={users}
        />

        <section section className="board-page">
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
          <NotesList boardId={boardId} boardUsers={users} />
        </section>
      </>
    );
  }

  return content;
};

export default BoardPageNotes;
