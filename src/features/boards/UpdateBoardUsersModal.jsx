import { useState, useEffect } from 'react';
import { useUpdateBoardUsersMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useGetUsersQuery } from '../users/usersApiSlice';
import Select from 'react-select';

const UpdateBoardUsersModal = ({ boardUsers, boardAdmins, boardId }) => {
  const [users, setUsers] = useState(boardUsers.map((admin) => admin._id));
  const [admins, setAdmins] = useState(boardAdmins.map((admin) => admin._id));
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

  const usersOptions = data.filter((user) => !admins.includes(user._id));

  const options = usersOptions.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const defaultValue = [];
  options.forEach((option) => {
    console.log('looping');
    if (users.includes(option.value)) {
      defaultValue.push(option);
    }
  });

  const onSelectChange = (choices) => {
    setUsers(() => {
      return choices.map((choice) => choice.value);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isUpdateLoading) {
      if (users.length) {
        let usersIds = users.map((user) => user._id);
        await updateUsers({ boardId, users: usersIds });
      }
    }
  };

  const content = (
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
        <button className="icon-button" title="Save" disabled={isUpdateLoading}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </div>
  );

  return content;
};

export default UpdateBoardUsersModal;
