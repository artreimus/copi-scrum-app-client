import { useState, useEffect } from 'react';
import { useUpdateBoardAdminsMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import setArrayIds from '../../utils/setArrayIds';

const UpdateBoardAdminsModal = ({
  boardAdmins,
  boardUsers,
  boardId,
  showAdminModal,
  setShowAdminModal,
}) => {
  const [admins, setAdmins] = useState(setArrayIds(boardAdmins));

  const [updateAdmins, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardAdminsMutation();

  const onSelectChange = (choices) => {
    setAdmins(() => {
      return choices.map((choice) => choice.value);
    });
  };

  const canSave = !isLoading && admins.length;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      const users = allUsers.filter((user) => admins.includes(user._id));
      console.log(users);
      await updateAdmins({ boardId, admins });
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

  const onCloseModalClicked = () => {
    setShowAdminModal(false);
  };

  const content = (
    <div className={showAdminModal ? `modal-show modal` : `modal-hidden modal`}>
      <div className="modal-content">
        <button onClick={onCloseModalClicked}>Close</button>
        <h1>Add Admins</h1>
        <div className="form">
          <form className="form" onSubmit={onSubmit}>
            <Select
              defaultValue={defaultValue}
              options={options}
              isMulti={true}
              menuShouldScrollIntoView={true}
              onChange={onSelectChange}
            />
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardAdminsModal;
