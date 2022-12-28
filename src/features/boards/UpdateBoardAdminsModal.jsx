import { useState, useEffect } from 'react';
import { useUpdateBoardAdminsMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import setArrayIds from '../../utils/setArrayIds';
import InfoIcon from '../../components/InfoIcon';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const UpdateBoardAdminsModal = ({
  boardAdmins,
  boardUsers,
  boardId,
  setIsOpen,
}) => {
  const [admins, setAdmins] = useState(setArrayIds(boardAdmins));

  const [updateAdmins, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardAdminsMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  const onSelectChange = (choices) => {
    setAdmins(() => {
      return choices.map((choice) => choice.value);
    });
  };

  const canSave = !isLoading && admins.length;

  useEffect(() => {
    if (isSuccess) setIsOpen(false);
  }, [isSuccess]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      const users = allUsers.filter((user) => admins.includes(user._id));
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

  const content = (
    <div className="container--modal">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">Edit Board Admins</h3>
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
              <p className="modal__form__label">Admins</p>
              <InfoIcon
                msg={
                  'Must be a user to add as admin. Removing as admin downgrades to user'
                }
              />
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
            disabled={!canSave}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardAdminsModal;
