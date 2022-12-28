import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDeleteBoardMutation } from './boardsApiSlice';
import { useNavigate } from 'react-router-dom';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';

const DeleteBoardModal = ({ boardId, setIsOpen }) => {
  const [deleteBoard, { isSuccess, isLoading, isError, error }] =
    useDeleteBoardMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate('/dash/boards');
  }, [isSuccess]);

  const onDeleteBtnClicked = async () => {
    await deleteBoard(boardId);
  };

  const content = (
    <div className="container--modal">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <div className="modal" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-content__form">
        <div className="modal__header">
          <h3 className="modal__title">Delete Board</h3>
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
          Hey there! If you delete this board, all the notes within it will also
          be deleted. Are you sure you want to proceed with this action?
        </p>
        <div className="center-all">
          <button
            className="btn--red modal__btn--prompt"
            onClick={onDeleteBtnClicked}
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

export default DeleteBoardModal;
