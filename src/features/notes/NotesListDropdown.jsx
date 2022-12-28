import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import useWindowSize from '../../hooks/useWindowSize';

const NotesListDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const windowSize = useWindowSize();
  const nodeRef = useRef(null);

  return (
    <div className="notes-list__dropdown">
      <div className="flex-row notes-list__dropdown__container--header">
        <h3 className="notes-list__dropdown__title">{title}</h3>
        {children.length > 0 && (
          <button
            className="btn--chevron"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
          </button>
        )}
      </div>
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={100}
        classNames="notes-dropdown"
        unmountOnExit
      >
        <ul className="notes-list__dropdown__list" ref={nodeRef}>
          {children}
        </ul>
      </CSSTransition>
      {windowSize.width <= 1413 && (
        <hr className="notes-list__dropdown__divider" />
      )}
    </div>
  );
};

export default NotesListDropdown;
