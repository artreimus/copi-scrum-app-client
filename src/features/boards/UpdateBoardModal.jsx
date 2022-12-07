import { useState, useEffect } from 'react';
import { useUpdateBoardMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';

const UpdateBoardModal = ({ board, boardId }) => {
  const [title, setTitle] = useState(board?.title);
  const [description, setDescription] = useState(board?.description);
  const [startDate, setStartDate] = useState(board?.startDate);
  const [endDate, setEndDate] = useState(board?.endDate);
  const [completed, setCompleted] = useState(board?.completed);

  const [updateBoard, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardMutation();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const handleToggle = () => setCompleted((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      const updatedBoard = { title, description, completed };
      if (startDate) updatedBoard.startDate = startDate;
      if (endDate) updatedBoard.endDate = endDate;
      await updateBoard({ boardId, board: updatedBoard });
    }
  };

  const content = (
    <div className="form">
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
        <label htmlFor="persist" className="form__persist">
          <input
            type="checkbox"
            className="form__checkbox"
            id="persist"
            onChange={handleToggle}
            checked={completed}
          />
          Completed
        </label>
        <button className="icon-button" title="Save" disabled={isLoading}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </div>
  );

  return content;
};

export default UpdateBoardModal;
