import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ErrorModal = ({ message, setIsOpen }) => {
  return (
    <div className="modal" onClick={() => setIsOpen(false)}>
      <div className="modal-content modal-error flex-row">
        <p className="modal-error__msg">{message}</p>
        <button
          className="modal-error__btn"
          onClick={() => {
            setIsOpen(false);
            // toggleIsOpen();
            console.log('close!');
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
