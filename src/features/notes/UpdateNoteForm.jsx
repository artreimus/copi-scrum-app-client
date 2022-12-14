import { useUpdateNoteMutation } from './notesApiSlice';
import { useGetSingleBoardQuery } from '../boards/boardsApiSlice';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { NOTE_STATUS } from '../../config/noteStatus';
import DatePicker from 'react-date-picker';
import verifyNoteStatus from '../../utils/verifyNoteStatus';

const UpdateNoteForm = ({ note }) => {
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
          <Select
            defaultValue={defaultValue}
            options={options}
            isMulti={true}
            onChange={onSelectChange}
          />
          <Select
            defaultValue={statusDefaultValue}
            options={statusOptions}
            onChange={onStatusChange}
          />
          <DatePicker
            onChange={setStartDate}
            value={startDate ? new Date(startDate) : null}
            required={
              status === NOTE_STATUS.InProgress ||
              status === NOTE_STATUS.Testing ||
              status === NOTE_STATUS.Done
            }
          />
          <DatePicker
            onChange={setEndDate}
            value={endDate ? new Date(endDate) : null}
            required={status === NOTE_STATUS.Done}
          />
          <button
            className="icon-button"
            title="Save"
            disabled={
              !verifyNoteStatus({ status, startDate, endDate }) ||
              isUpdateLoading
            }
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
        </form>
      </div>
    );

    return content;
  }
};

export default UpdateNoteForm;
