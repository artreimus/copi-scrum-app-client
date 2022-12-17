import { useState, useEffect } from 'react';
import { useAddNewBoardMutation } from './boardsApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';

const NewBoardModal = ({ setIsOpen }) => {
  const [addNewBoard, { isLoading, isSuccess, isError, error }] =
    useAddNewBoardMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const canSave =
    [title, description, startDate, endDate].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    console.log('submitted pls werk');

    e.preventDefault();
    if (canSave) {
      const newBoard = { title, description, startDate, endDate };
      if (password) newBoard.password = password;
      const result = await addNewBoard(newBoard);
      navigate(`/dash/boards/${result.data.board._id}`);
    }
  };

  const onModalBgClicked = (e) => {
    e.preventDefault();

    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const content = (
    <div className="test-1">
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">New Board</h3>
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
            <label htmlFor="title" className="modal__form__label">
              Title
            </label>
            <input
              className="modal__form__input"
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleChanged}
            />
          </div>

          <div className="flex-col modal__form__container__input">
            <label htmlFor="description" className="modal__form__label">
              Description
            </label>
            <input
              className="modal__form__input"
              id="description"
              name="description"
              type="textarea"
              autoComplete="off"
              value={description}
              onChange={onDescriptionChanged}
            />
          </div>
          <div className="flex-col modal__form__container__input">
            <label htmlFor="password" className="modal__form__label">
              Password
            </label>
            <input
              className="modal__form__input"
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={onPasswordChanged}
            />
          </div>
          <div className="modal__form__container__date">
            <p className="modal__form__label">Start Date (Target)</p>
            <DatePicker
              onChange={setStartDate}
              value={startDate ? new Date(startDate) : null}
            />
          </div>
          <div className="modal__form__container__date">
            <p className="modal__form__label">End Date (Target)</p>
            <DatePicker
              onChange={setEndDate}
              value={endDate ? new Date(endDate) : null}
            />
          </div>
          <button
            className="btn--blue modal__form__btn"
            title="Save"
            disabled={!canSave}
            type="submit"
            // onClick={() => console.log('submitted!!!')}
          >
            CREATE
          </button>
        </form>
      </div>
    </div>
  );

  return content;
};

export default NewBoardModal;
