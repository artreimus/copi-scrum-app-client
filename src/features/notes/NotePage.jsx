import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleNoteQuery } from './notesApiSlice';
import Loader from 'react-spinners/MoonLoader';
import UpdateNoteForm from './UpdateNoteModal';
import formatDate from '../../utils/formatDate';
import useToggleModal from '../../hooks/useToggleModal';
import useWindowSize from '../../hooks/useWindowSize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from '../../components/ErrorModal';

const NotePage = () => {
  const { id: noteId } = useParams();
  const [isOpen, setIsOpen] = useToggleModal();
  const windowSize = useWindowSize();
  const navigate = useNavigate();

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

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

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

  if (isSuccess) {
    const { note } = data;
    let { title, text, users, startDate, endDate, boardId } = note;

    if (startDate) {
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    const usersElement = users?.map((user, index) => (
      <p key={user._id} className="profile-tab__menu__btn center-all">
        {user.username.charAt(0)}
      </p>
    ));

    return (
      <section className="boards-list">
        <div className="section__header section__header__note-page flex-row center-all">
          <button
            className="section__header__button section__header__button--primary--left "
            onClick={() => navigate(`/dash/boards/${boardId}`)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="section__header__button btn--blue"
            onClick={() => setIsOpen(true)}
          >
            {windowSize.width > 600 && 'Edit Note'}
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
        <article className="article--white article__about">
          <h3 className="article__about__title">{title}</h3>
          <div>
            <p className="article__about__label">Text</p>
            <p className="article__about__container__text">{text}</p>
          </div>
          <div className="article__about__grid">
            <p className="article__about__label">Start Date (Target)</p>
            <p>{startDate ?? 'None'}</p>
            <p className="article__about__label">End Date (Target)</p>
            <p>{endDate ?? 'None'}</p>
            <p className="article__about__label">Assigned users</p>
            <div className="article__about__container--users grid--users">
              {usersElement.length || 'None'}
            </div>
          </div>
          <div className="flex-row"></div>
        </article>
        {isOpen && <UpdateNoteForm note={note} setIsOpen={setIsOpen} />}
      </section>
    );
  }
};

export default NotePage;
