import PulseLoader from 'react-spinners/PulseLoader';
import { useAddNewNoteMutation } from './notesApiSlice';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import InfoIcon from '../../components/InfoIcon';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const NewNoteModal = ({ boardId, boardUsers, setIsOpen }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);

  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setText('');
    }
  }, [isSuccess]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);

  const options = boardUsers?.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const onSelectChange = (choices) =>
    setUsers(() => {
      return choices.map((choice) => choice.value);
    });

  if (isLoading) return <PulseLoader color="#FFF" />;
  const canSave = [title, text].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      const newNote = { title, text, users, boardId };
      await addNewNote(newNote);
    }
  };

  const content = (
    <div className="container--modal">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">New Note</h3>
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
                Text
              </label>
              <InfoIcon msg={'5-100 characters'} />
            </div>

            <textarea
              className="modal__form__input"
              id="text"
              name="text"
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
              defaultValue={null}
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
            Create
          </button>
        </form>
      </div>
    </div>
  );

  return content;
};

export default NewNoteModal;
