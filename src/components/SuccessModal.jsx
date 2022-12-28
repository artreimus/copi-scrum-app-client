import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const SuccessModal = ({ message, setIsOpen }) => {
  return (
    <div className="modal-success">
      <div className="modal-success__content flex-row">
        <p>{message}</p>
        <button
          className="modal-success__btn"
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

export default SuccessModal;
