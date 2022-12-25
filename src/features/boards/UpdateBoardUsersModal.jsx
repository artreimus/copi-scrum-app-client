import { useState } from 'react';
import { useUpdateBoardUsersMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useGetUsersQuery } from '../user/usersApiSlice';
import Select from 'react-select';
import setArrayIds from '../../utils/setArrayIds';
import InfoIcon from '../../components/InfoIcon';

const UpdateBoardUsersModal = ({
  boardUsers,
  boardAdmins,
  boardId,
  setIsOpen,
}) => {
  const [users, setUsers] = useState(setArrayIds(boardUsers));

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
    <div className="container--modal">
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">Edit Board Users</h3>
          <button
            className="modal__btn--close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form className="modal__form" onSubmit={onSubmit}>
          <div className="flex-col modal__form__container__input">
            <div className="flex-row modal__form__container__input--label">
              <p className="modal__form__label">Users</p>
              <InfoIcon msg={'Removing user remove him/her from the board'} />
            </div>
            <Select
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: 'black',
                  borderRadius: '10px',
                  fontSize: '1rem',
                }),
              }}
              defaultValue={defaultValue}
              options={options}
              isMulti={true}
              menuShouldScrollIntoView={true}
              onChange={onSelectChange}
            />
          </div>
          <button
            className="btn--blue modal__form__btn"
            title="Save"
            disabled={isUpdateLoading}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardUsersModal;
