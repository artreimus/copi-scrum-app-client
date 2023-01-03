import { useParams } from 'react-router-dom';
import EditUserForm from './EditUserForm';
import { useGetSingleUserQuery } from './usersApiSlice';
import Loader from 'react-spinners/MoonLoader';
import useTitle from '../../hooks/useTitle';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const EditUser = () => {
  useTitle('Copi');
  const { id } = useParams();

  const { data, isSuccess, isLoading, isError, error } =
    useGetSingleUserQuery(id);
  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  if (isLoading)
    return (
      <section className="user-profile center-all">
        <div className="center-all container--loader">
          <Loader color="#fff" size={130} />
        </div>
      </section>
    );

  if (isError && isErrorOpen) {
    return (
      <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
    );
  }

  let content = null;

  if (isSuccess) {
    content = (
      <section className="user-profile">
        <EditUserForm user={data.user} />
      </section>
    );
  }

  return content;
};

export default EditUser;
