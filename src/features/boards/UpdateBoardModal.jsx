import { useState, useEffect } from 'react';
import { useUpdateBoardMutation } from './boardsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';

const UpdateBoardModal = ({
  board,
  boardId,
  showBoardModal,
  setShowBoardModal,
}) => {
  const [title, setTitle] = useState(board?.title);
  const [description, setDescription] = useState(board?.description);
  const [startDate, setStartDate] = useState(board?.startDate);
  const [endDate, setEndDate] = useState(board?.endDate);

  const [updateBoard, { isSuccess, isLoading, isError, error }] =
    useUpdateBoardMutation();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      const updatedBoard = { title, description, startDate, endDate };
      await updateBoard({ boardId, board: updatedBoard });
    }
  };

  const onCloseModalClicked = () => {
    setShowBoardModal(false);
  };

  const content = (
    <div className={showBoardModal ? `modal-show modal` : `modal-hidden modal`}>
      <div className="modal-content">
        <button onClick={onCloseModalClicked}>Close</button>
        <h1>Edit Board</h1>
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
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              name="description"
              type="textarea"
              autoComplete="off"
              value={description}
              onChange={onDescriptionChanged}
            />
            <DatePicker
              onChange={setStartDate}
              value={startDate ? new Date(startDate) : null}
            />
            <DatePicker
              onChange={setEndDate}
              value={endDate ? new Date(endDate) : null}
            />
            <button className="icon-button" title="Save" disabled={isLoading}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return content;
};

export default UpdateBoardModal;
