import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useLeaveBoardMutation } from './boardsApiSlice';
import useAuth from '../../hooks/useAuth';

const LeaveBoardModal = ({ boardId, setIsOpen, boardUsers }) => {
  const [leaveBoard, { isSuccess, isLoading, isError, error }] =
    useLeaveBoardMutation();
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate('/dash/boards');
  }, [isSuccess]);

  const onLeaveBtnClicked = async (e) => {
    if (!isLoading) {
      await leaveBoard({ boardId });
    }
  };

  const content = (
    <div className="container--modal">
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">Leave Board</h3>
          <button
            className="modal__btn--close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <p className="modal__text--prompt">
          Are you sure you want to leave this board?
        </p>
        <div className="center-all">
          <button
            className="btn--red modal__btn--prompt"
            onClick={onLeaveBtnClicked}
            disabled={isLoading}
          >
            Delete
          </button>
          <button
            className="btn--blue modal__btn--prompt"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return content;
};

export default LeaveBoardModal;
