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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
    }
  }, [isSuccess]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const canSave = [title, description].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      const newBoard = { title, description };
      if (startDate) newBoard.startDate = startDate;
      if (endDate) newBoard.endDate = endDate;
      await addNewBoard(newBoard);
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
        <DatePicker onChange={setStartDate} value={startDate} />
        <DatePicker onChange={setEndDate} value={endDate} />
        <button className="icon-button" title="Save" disabled={!canSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </div>
  );

  return content;
};

export default NewBoardModal;
