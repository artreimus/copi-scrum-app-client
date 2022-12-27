import { useUpdateNoteMutation } from './notesApiSlice';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { NOTE_STATUS } from '../../config/noteStatus';
import DatePicker from 'react-date-picker';
import verifyNoteStatus from '../../utils/verifyNoteStatus';
import InfoIcon from '../../components/InfoIcon';
import validateDates from '../../utils/validateDates';

const UpdateNoteForm = ({ note, setIsOpen }) => {
  const [title, setTitle] = useState(note?.title);
  const [text, setText] = useState(note?.text);
  const [status, setStatus] = useState(note?.status);
  const [users, setUsers] = useState([...note?.users]);
  const [startDate, setStartDate] = useState(note?.startDate ?? null);
  const [endDate, setEndDate] = useState(note?.endDate ?? null);

  const [
    updateNote,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateNoteMutation();

  const {
    data,
    isLoading: isBoardLoading,
    isSuccess: isBoardSuccess,
    isError: isBoardError,
    error: boardError,
  } = useGetSingleBoardQuery(note.boardId);

  useEffect(() => {
    if (isUpdateSuccess) setIsOpen(false);
  }, [isUpdateSuccess]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);

  const onSelectChange = (choices) =>
    setUsers(() => {
      return choices.map((choice) => choice.value);
    });

  const onStatusChange = (status) => {
    setStatus(status.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isUpdateLoading && verifyNoteStatus({ status, startDate, endDate })) {
      const updatedNote = { title, text, users, status, startDate, endDate };
      await updateNote({ noteId: note._id, note: updatedNote });
    }
  };

  if (isBoardSuccess) {
    const options = [...data.board.users, ...data.board.admins].map((user) => ({
      value: user._id,
      label: user.username,
    }));

    const statusOptions = Object.values(NOTE_STATUS).map((status) => ({
      value: status,
      label: status,
    }));

    const defaultValue = [];
    options.forEach((option) => {
      if (users.includes(option.value)) {
        defaultValue.push(option);
      }
    });

    const statusDefaultValue = { value: status, label: status };

    const content = (
      <div className="container--modal">
        <div className="modal" onClick={() => setIsOpen(false)}></div>
        <div className="modal-content modal-content__form">
          <div className="modal__header">
            <h3 className="modal__title">Edit Note</h3>
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
                <label htmlFor="title" className="modal__form__label">
                  Title
                </label>
                <InfoIcon msg={'5-25 characters'} />
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
                <label htmlFor="text" className="modal__form__label">
                  Description
                </label>
                <InfoIcon msg={'5-100 characters'} />
              </div>

              <textarea
                className="modal__form__input"
                name="text"
                id="text"
                autoComplete="off"
                value={text}
                onChange={onTextChanged}
                minLength="5"
                maxLength="100"
              />
            </div>
            <div className="flex-col modal__form__container__input">
              <p className="modal__form__label">Assigned Users</p>

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
                onChange={onSelectChange}
              />
            </div>
            <div className="flex-col modal__form__container__input">
              <p className="modal__form__label">Status</p>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: 'black',
                    borderRadius: '10px',
                    fontSize: '1rem',
                  }),
                }}
                defaultValue={statusDefaultValue}
                options={statusOptions}
                onChange={onStatusChange}
              />
            </div>

            <div className="flex-col modal__form__container__date">
              <div className="flex-row modal__form__container__input--label">
                <p className="modal__form__label">Start Date</p>{' '}
                <InfoIcon msg={'Start Date must be in sync with status'} />
              </div>
              <DatePicker
                onChange={setStartDate}
                value={startDate ? new Date(startDate) : null}
                required={
                  status === NOTE_STATUS.InProgress ||
                  status === NOTE_STATUS.Testing ||
                  status === NOTE_STATUS.Done
                }
              />
            </div>

            <div className="flex-col modal__form__container__date">
              <div className="flex-row modal__form__container__input--label">
                <p className="modal__form__label">End Date</p>{' '}
                <InfoIcon msg={'End Date must be in sync with status'} />
              </div>
              <DatePicker
                onChange={setEndDate}
                value={endDate ? new Date(endDate) : null}
                required={status === NOTE_STATUS.Done}
              />
            </div>

            <button
              className="btn--blue modal__form__btn"
              title="Save"
              disabled={
                !verifyNoteStatus({ status, startDate, endDate }) ||
                isUpdateLoading ||
                !validateDates(startDate, endDate)
              }
            >
              Update
            </button>
          </form>
        </div>
      </div>
    );

    return content;
  }
};

export default UpdateNoteForm;
