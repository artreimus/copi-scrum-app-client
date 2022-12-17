import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const InfoIcon = ({ msg }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div
      className="info-icon"
      // onMouseEnter={() => setIsShown(true)}
      // onMouseLeave={() => setIsShown(false)}
      onClick={() => setIsShown((prev) => !prev)}
    >
      <FontAwesomeIcon icon={faCircleInfo} />
      {isShown && <div className="floating-menu">{msg}</div>}
    </div>
  );
};

export default InfoIcon;
