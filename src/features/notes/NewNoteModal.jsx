import PulseLoader from 'react-spinners/PulseLoader';
import DatePicker from 'react-date-picker';
import { useAddNewNoteMutation } from './notesApiSlice';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const NewNoteModal = ({ boardId, boardUsers }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [users, setUsers] = useState([]);

  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setText('');
      setStartDate(null);
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
      if (startDate) newNote.startDate = startDate;
      await addNewNote(newNote);
    }
  };

  const content = (
    <div>
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
        <textarea id="text" name="text" value={text} onChange={onTextChanged} />
        <Select
          defaultValue={null}
          options={options}
          isMulti={true}
          menuShouldScrollIntoView={true}
          onChange={onSelectChange}
          onSubmit={() => console.log('SUBMITTING SELECT FORMS')}
        />
        <DatePicker onChange={setStartDate} value={startDate} />
        <button title="Save" disabled={!canSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
      <p>Select</p>
    </div>
  );

  return content;
};

export default NewNoteModal;
