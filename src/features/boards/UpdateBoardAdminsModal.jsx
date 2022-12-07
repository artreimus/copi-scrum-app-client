import { useState, useEffect } from 'react';
import { useUpdateBoardAdminsMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const UpdateBoardAdminsModal = ({ boardAdmins, boardUsers, boardId }) => {
  const [admins, setAdmins] = useState(boardAdmins.map((admin) => admin._id));

  const [updateAdmins, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardAdminsMutation();

  const onSelectChange = (choices) => {
    setAdmins(() => {
      return choices.map((choice) => choice.value);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      if (admins.length) {
        const users = allUsers.filter((user) => admins.includes(user._id));
        console.log(users);
        await updateAdmins({ boardId, admins });
      }
    }
  };

  const allUsers = [...boardAdmins, ...boardUsers];

  const options = allUsers.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const defaultValue = [];
  options.forEach((option) => {
    if (admins.includes(option.value)) {
      defaultValue.push(option);
    }
  });

  const content = (
    <div className="form">
      <h1>Add Admins</h1>
      <form className="form" onSubmit={onSubmit}>
        <Select
          defaultValue={defaultValue}
          options={options}
          isMulti={true}
          menuShouldScrollIntoView={true}
          onChange={onSelectChange}
        />
        <button className="icon-button" title="Save" disabled={isLoading}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </div>
  );

  return content;
};

export default UpdateBoardAdminsModal;
