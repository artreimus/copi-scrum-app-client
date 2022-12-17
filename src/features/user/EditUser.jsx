import { useParams } from 'react-router-dom';
import EditUserForm from './EditUserForm';
import { useGetUsersQuery } from './usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

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

  if (isLoading) return <PulseLoader color={'#FFF'} />;

  if (isError) {
    return <p className="errmsg">{error.data.message}</p>;
  }

  return (
    <section className="user-profile center-all">
      {isSuccess ? <EditUserForm user={user} /> : null}
    </section>
  );
};

export default EditUser;
