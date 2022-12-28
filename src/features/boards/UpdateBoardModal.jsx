import { useState, useEffect } from 'react';
import { useUpdateBoardMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';
import InfoIcon from '../../components/InfoIcon';
import validateDates from '../../utils/validateDates';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

const UpdateBoardModal = ({ board, boardId, setIsOpen }) => {
  const [title, setTitle] = useState(board?.title);
  const [description, setDescription] = useState(board?.description);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordMessage, setNewPasswordMessage] = useState('');

  const [startDate, setStartDate] = useState(board?.startDate);
  const [endDate, setEndDate] = useState(board?.endDate);

  const [updateBoard, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);
  const [isSuccessOpen, setIsSuccessOpen] = useToggleModal(isSuccess);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onOldpasswordChanged = (e) => setOldPassword(e.target.value);
  const onNewPasswordChanged = (e) => setNewPassword(e.target.value);

  const canSave =
    [title, description, startDate, endDate].every(Boolean) &&
    !isLoading &&
    validateDates(startDate, endDate);

  useEffect(() => {
    if (board.private) {
      setNewPasswordMessage(
        'If changing password leave blank to set board as public. 6-100 characters if needed'
      );
    } else {
      setNewPasswordMessage('Leave blank to not change password.');
    }
  }, [board.private]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      const updatedBoard = { title, description, startDate, endDate };
      if (oldPassword) updatedBoard.oldPassword = oldPassword;
      if (newPassword) updatedBoard.newPassword = newPassword;
      await updateBoard({ boardId, board: updatedBoard });
    }
  };

  const content = (
    <div className="container--modal">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      {isSuccessOpen && (
        <SuccessModal
          message={'Board successfully updated'}
          setIsOpen={setIsSuccessOpen}
        />
      )}

      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">Edit Board</h3>
          <button
            className="modal__btn--close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form c className="modal__form" onSubmit={onSubmit}>
          <div className="flex-col modal__form__container__input">
            <div className="flex-row modal__form__container__input--label">
              <label htmlFor="title" className="modal__form__label">
                Title
              </label>
              <InfoIcon msg={'5 to 25 characters'} />
            </div>
            <input
              className="modal__form__input"
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleChanged}
              minLength="5"
              maxLength="25"
            />
          </div>
          <div className="flex-col modal__form__container__input">
            <div className="flex-row modal__form__container__input--label">
              <label htmlFor="title" className="modal__form__label">
                Description
              </label>
              <InfoIcon msg={'5 to 100 characters'} />
            </div>
            <textarea
              className="modal__form__input"
              id="description"
              name="description"
              autoComplete="off"
              value={description}
              onChange={onDescriptionChanged}
              minLength="5"
              maxLength="100"
            />
          </div>
          {board.private && (
            <div className="flex-col modal__form__container__input">
              <div className="flex-row modal__form__container__input--label">
                <label htmlFor="oldPassword" className="modal__form__label">
                  Old Password
                </label>
                <InfoIcon msg={'Leave blank to not change password'} />
              </div>
              <input
                className="modal__form__input"
                id="oldPassword"
                name="oldPassword"
                type="password"
                autoComplete="off"
                value={oldPassword}
                placeholder="Leave blank to not change password"
                onChange={onOldpasswordChanged}
              />
            </div>
          )}
          <div className="flex-col modal__form__container__input">
            <div className="flex-row modal__form__container__input--label">
              <label htmlFor="newPassword" className="modal__form__label">
                New Password
              </label>
              <InfoIcon msg={newPasswordMessage} />
            </div>
            <input
              className="modal__form__input"
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="off"
              value={newPassword}
              maxLength="100"
              placeholder={
                'If changing password leave blank to set board as public'
              }
              onChange={onNewPasswordChanged}
            />
          </div>
          <div className="flex-col modal__form__container__date">
            <p className="modal__form__label">Start Date</p>{' '}
            <DatePicker
              onChange={setStartDate}
              value={startDate ? new Date(startDate) : null}
            />
          </div>
          <div className="flex-col modal__form__container__date">
            <p className="modal__form__label">Start Date</p>
            <DatePicker
              onChange={setEndDate}
              value={endDate ? new Date(endDate) : null}
            />
          </div>
          <button
            className="btn--blue modal__form__btn"
            title="Save"
            disabled={!canSave}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardModal;
