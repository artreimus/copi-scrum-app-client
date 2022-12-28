import { useEffect, useState } from 'react';

const useToggleModal = (triggerChange = false) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (triggerChange) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [triggerChange]);

  return [isOpen, setIsOpen];
};

export default useToggleModal;
