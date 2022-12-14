import { useState, useEffect } from 'react';
import { useAddNewBoardMutation } from './boardsApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';
import useAuth from '../../hooks/useAuth';

const NewBoardModal = () => {
  const [addNewBoard, { isLoading, isSuccess, isError, error }] =
    useAddNewBoardMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [boardId, setBoardId] = useState('');

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      navigate(`/dash/boards/${boardId}`);
    }
  }, [isSuccess]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const canSave =
    [title, description, startDate, endDate].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      const newBoard = { title, description, startDate, endDate };
      if (password) newBoard.password = password;
      const result = await addNewBoard(newBoard);
      setBoardId(result.data.board._id);
    }
  };

  const content = (
    <div className="form">
      <h1>New Board</h1>
      <p>{error?.data?.message}</p>

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
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          name="description"
          type="textarea"
          autoComplete="off"
          value={description}
          onChange={onDescriptionChanged}
        />
        <label htmlFor="password">Board Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        />
        <DatePicker
          onChange={setStartDate}
          value={startDate ? new Date(startDate) : null}
        />
        <DatePicker
          onChange={setEndDate}
          value={endDate ? new Date(endDate) : null}
        />
        <button className="icon-button" title="Save" disabled={!canSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </div>
  );

  return content;
};

export default NewBoardModal;
