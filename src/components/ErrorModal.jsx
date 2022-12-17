import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ErrorModal = ({ message, setIsOpen }) => {
  return (
    <div className="modal">
      <div className="modal-bg" onClick={() => setIsOpen(false)}></div>
      <div className="modal-content modal-error flex-row">
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
