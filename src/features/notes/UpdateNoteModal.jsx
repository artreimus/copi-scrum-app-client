import { useUpdateNoteMutation } from './notesApiSlice';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import PulseLoader from 'react-spinners/PulseLoader';

const UpdateNoteModal = ({ note }) => {
  const [title, setTitle] = useState(note?.title);
  const [text, setText] = useState(note?.text);
  const [startDate, setStartDate] = useState(note?.startDate ?? null);
  const [endDate, setEndDate] = useState(note?.endDate ?? null);
  const [users, setUsers] = useState([...note?.users]);

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

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onSelectChange = (choices) =>
    setUsers(() => {
      return choices.map((choice) => choice.value);
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isUpdateLoading) {
      const updatedNote = { title, text, users };
      if (startDate) updatedNote.startDate = startDate;
      if (endDate) updatedNote.endDate = endDate;
      await updateNote({ noteId: note._id, note: updatedNote });
    }
  };

  if (isBoardSuccess) {
    const options = [...data.board.users, ...data.board.admins].map((user) => ({
      value: user._id,
      label: user.username,
    }));

    const defaultValue = [];
    options.forEach((option) => {
      if (users.includes(option.value)) {
        defaultValue.push(option);
      }
    });

    const content = (
      <div className="form">
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
          <label htmlFor="text">Description:</label>
          <input
            id="text"
            name="text"
            type="textarea"
            autoComplete="off"
            value={text}
            onChange={onTextChanged}
          />
          <DatePicker
            onChange={setStartDate}
            value={startDate ? new Date(startDate) : null}
          />
          <DatePicker
            onChange={setEndDate}
            value={endDate ? new Date(endDate) : null}
          />
          <Select
            defaultValue={defaultValue}
            options={options}
            isMulti={true}
            menuShouldScrollIntoView={true}
            onChange={onSelectChange}
          />
          <button
            className="icon-button"
            title="Save"
            disabled={isUpdateLoading}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
        </form>
      </div>
    );

    return content;
  }
};

export default UpdateNoteModal;
