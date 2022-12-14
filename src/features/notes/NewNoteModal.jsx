import PulseLoader from 'react-spinners/PulseLoader';
import { useAddNewNoteMutation } from './notesApiSlice';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const NewNoteModal = ({
  boardId,
  boardUsers,
  showNewNoteModal,
  setNewShowNoteModal,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);

  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

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

  const onCloseModalClicked = () => {
    setNewShowNoteModal(false);
  };
  const content = (
    <div
      className={showNewNoteModal ? `modal-show modal` : `modal-hidden modal`}
    >
      <div className="modal-content">
        <button onClick={onCloseModalClicked}>Close</button>
        <h2>New Note</h2>
        <form className="form" onSubmit={onSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={onTextChanged}
          />
          <Select
            defaultValue={null}
            options={options}
            isMulti={true}
            menuShouldScrollIntoView={true}
            onChange={onSelectChange}
          />
          <button title="Save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </form>
        <p>Select</p>
      </div>
    </div>
  );

  return content;
};

export default NewNoteModal;
