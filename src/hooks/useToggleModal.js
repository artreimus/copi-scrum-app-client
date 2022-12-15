import { useEffect, useState } from 'react';

const useToggleModal = (isError) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      setIsOpen(true);
    }
  }, [isError]);

  return [isOpen, setIsOpen];
};

export default useToggleModal;
