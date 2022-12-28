import { useState, useEffect } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import authorizeUser from '../../utils/authorizeUser';
import formatDate from '../../utils/formatDate';
import useToggleModal from '../../hooks/useToggleModal';
import { useParams } from 'react-router-dom';
import { useGetSingleBoardQuery } from './boardsApiSlice';
import UpdateBoardModal from './UpdateBoardModal';
import BoardPageHeader from './BoardPageHeader';
import DeleteBoardModal from './DeleteBoardModal';
import ErrorModal from '../../components/ErrorModal';

const BoardPageAbout = () => {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUpdateBoardModalOpen, setIsUpdateBoardModalOpen] = useToggleModal();
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useToggleModal();
  const { userId } = useAuth();
  const windowSize = useWindowSize();

  const { id: boardId } = useParams();
  const {
    data,
    isLoading,
    isSuccess,

    isError,
    error,
  } = useGetSingleBoardQuery(boardId, 'boardPage', {
    // refetch options
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // const error = { data: { message: 'testing error msg' } };
  // const isError = true;

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

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
  }, [isSuccess]);

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  if (isError && isErrorOpen)
    return (
      <ErrorModal message={error.data.message} setIsOpen={setIsErrorOpen} />
    );

  let content = null;

  if (isSuccess) {
    const { board } = data;
    let {
      title,
      description,
      admins,
      users,
      startDate,
      endDate,
      private: isPrivate,
    } = board;

    if (startDate) {
      startDate = formatDate(startDate);
    }

    if (endDate) {
      endDate = formatDate(endDate);
    }

    const adminsElement = admins?.map((admin, index) => (
      <p key={index} className="profile-tab__menu__btn center-all">
        {admin.username.charAt(0)}
      </p>
    ));
    const usersElement = users?.map((user, index) => (
      <p key={user._id} className="profile-tab__menu__btn center-all">
        {user.username.charAt(0)}
      </p>
    ));

    content = (
      <>
        <BoardPageHeader
          boardId={boardId}
          isUserAdmin={isUserAdmin}
          admins={admins}
          users={users}
        />

        {isErrorOpen && (
          <ErrorModal
            message={error?.data?.message}
            setIsOpen={setIsErrorOpen}
          />
        )}
        <section section className="board-page">
          <div className="section__header section__header__board-page__about flex-row">
            {isUserAdmin && (
              <>
                <button
                  className="section__header__button  section__header__button--secondary btn--red"
                  onClick={() => setIsDeleteBoardModalOpen(true)}
                >
                  {windowSize.width > 600 && 'Delete Board'}
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  className="section__header__button btn--blue"
                  onClick={() => setIsUpdateBoardModalOpen(true)}
                >
                  {windowSize.width > 600 && 'Edit Board'}
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              </>
            )}
          </div>
          <article className="article--white article__about">
            <h3 className="article__about__title">{title}</h3>
            <div>
              <p className="article__about__label">Description</p>
              <p className="article__about__container__text">{description}</p>
            </div>
            <div className="article__about__grid">
              <p className="article__about__label">Start Date (Target)</p>
              <p>{startDate}</p>
              <p className="article__about__label">Private</p>
              <p className="article__about__text--private">
                {isPrivate.toString()}
              </p>
              <p className="article__about__label">End Date (Target)</p>
              <p>{endDate}</p>
              <p className="article__about__label">admins</p>
              <div className="article__about__container--users grid--users">
                {adminsElement}
              </div>
              <p className="article__about__label">users</p>
              <div className="article__about__container--users grid--users">
                {usersElement}
              </div>
            </div>
            <div className="flex-row"></div>
          </article>
          {isUpdateBoardModalOpen && (
            <UpdateBoardModal
              board={board}
              boardId={boardId}
              setIsOpen={setIsUpdateBoardModalOpen}
            />
          )}
          {isDeleteBoardModalOpen && (
            <DeleteBoardModal
              boardId={boardId}
              setIsOpen={setIsDeleteBoardModalOpen}
            />
          )}
        </section>
      </>
    );
  }

  return content;
};

export default BoardPageAbout;
