import { useState, useEffect } from 'react';
import { USER_REGEX } from '../config/authRegex';

const useValidateUsername = (username) => {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(USER_REGEX.test(username));
  }, [username]);

  return valid;
};

export default useValidateUsername;
