import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ErrorModal = ({ message, setIsOpen }) => {
  return (
    <div className="modal-error">
      <div className="modal-error__content flex-row">
        <p className="modal-error__msg">{message}</p>
        <button
          className="modal-error__btn"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
