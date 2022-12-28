import { useParams } from 'react-router-dom';
import EditUserForm from './EditUserForm';
import { useGetUsersQuery } from './usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const EditUser = () => {
  useTitle('Copi');
  const { id } = useParams();
  const { user, isSuccess, isLoading, isError, error } = useGetUsersQuery(
    'usersList',
    {
      selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
        user: data?.entities[id],
        isLoading,
        isSuccess,
        isError,
        error,
      }),
    }
  );

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);
  if (isLoading) return <PulseLoader color={'#FFF'} />;

  if (isError && isErrorOpen) {
    return (
      <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
    );
  }

  let content = null;

  if (isSuccess) {
    content = (
      <section className="user-profile center-all">
        <EditUserForm user={user} />
      </section>
    );
  }

  return content;
};

export default EditUser;
