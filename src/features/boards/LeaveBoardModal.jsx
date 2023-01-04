import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useLeaveBoardMutation } from './boardsApiSlice';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const LeaveBoardModal = ({ boardId, setIsOpen, boardUsers }) => {
  const navigate = useNavigate();

  const [leaveBoard, { isSuccess, isLoading, isError, error }] =
    useLeaveBoardMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

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
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
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
          Leaving will remove all your assigned notes in the board. Are you sure
          you want to leave this board?
        </p>
        <div className="center-all">
          <button
            className="btn--red modal__btn--prompt"
            onClick={onLeaveBtnClicked}
            disabled={isLoading}
          >
            Leave
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
