import useAuth from '../../hooks/useAuth';
import { useGetUserNotesQuery } from './notesApiSlice';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import Loader from 'react-spinners/MoonLoader';
import UserNote from './UserNote';

const UserNotes = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetUserNotesQuery(
    'userNotes',
    {
      selectFromResult: ({ data, isSuccess, isError, error, isLoading }) => ({
        data: data?.ids.map((id) => data?.entities[id]),
        isSuccess,
        isLoading,
        isError,
        error,
      }),
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

  let content = null;

  if (isSuccess) {
    const noteElements = data.map((note) => (
      <UserNote note={note} key={note._id} />
    ));

    content = (
      <section className="user-notes flex-col">
        <div className="section__header flex-row">
          <h2 className="section__title section__header__title truncate-text">
            User Notes
          </h2>
        </div>
        <div className="user-notes__container--notes">
          {noteElements}
          {noteElements}
        </div>
      </section>
    );
  }

  return content;
};

export default UserNotes;
