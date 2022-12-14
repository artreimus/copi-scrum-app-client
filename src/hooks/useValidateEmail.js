import { useState, useEffect } from 'react';
import { EMAIL_REGEX } from '../config/authRegex';

const useValidateEmail = (email) => {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(EMAIL_REGEX.test(email));
  }, [email]);

  return valid;
};

export default useValidateEmail;
