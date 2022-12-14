import { useState, useEffect } from 'react';
import { useUpdateBoardUsersMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useGetUsersQuery } from '../users/usersApiSlice';
import Select from 'react-select';
import setArrayIds from '../../utils/setArrayIds';

const UpdateBoardUsersModal = ({
  boardUsers,
  boardAdmins,
  boardId,
  showUserModal,
  setShowUserModal,
}) => {
  const [users, setUsers] = useState(setArrayIds(boardUsers));

  console.log('boardAdmins', boardAdmins);
  const [
    updateUsers,
    {
      isSuccess: isUpdateSuccess,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateBoardUsersMutation();

  const { data, isSuccess } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data, isSuccess }) => ({
      data: data?.ids.map((id) => data?.entities[id]),
      isSuccess,
    }),
  });

  const usersOptions = data.filter(
    (user) => !setArrayIds(boardAdmins).includes(user._id)
  );

  const options = usersOptions.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const defaultValue = [];
  options.forEach((option) => {
    if (users.includes(option.value)) {
      defaultValue.push(option);
    }
  });

  console.log('defaultValue', defaultValue);

  const onSelectChange = (choices) => {
    setUsers(() => {
      return choices.map((choice) => choice.value);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isUpdateLoading) {
      await updateUsers({ boardId, users });
    }
  };

  const onCloseModalClicked = () => {
    setShowUserModal(false);
  };

  const content = (
    <div className={showUserModal ? `modal-show modal` : `modal-hidden modal`}>
      <div className="modal-content">
        <button onClick={onCloseModalClicked}>Close</button>{' '}
        <div className="form">
          <h1>Add Users</h1>
          <form className="form" onSubmit={onSubmit}>
            <Select
              defaultValue={defaultValue}
              options={options}
              isMulti={true}
              menuShouldScrollIntoView={true}
              onChange={onSelectChange}
            />
            <button
              className="icon-button"
              title="Save"
              disabled={isUpdateLoading}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardUsersModal;
