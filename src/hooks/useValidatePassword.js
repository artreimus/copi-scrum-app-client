import { useState, useEffect } from 'react';
import { PWD_REGEX } from '../config/authRegex';

const useValidatePassword = (password) => {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(PWD_REGEX.test(password));
  }, [password]);

  return valid;
};

export default useValidatePassword;
