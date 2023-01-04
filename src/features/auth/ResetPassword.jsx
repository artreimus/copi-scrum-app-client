import { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import useValidatePassword from '../../hooks/useValidatePassword';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Loader from 'react-spinners/BeatLoader';

const ResetPassword = () => {
  useTitle('Copi');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const validPassword = useValidatePassword(password);
  const [modalMessage, setModalMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(true);
      setTimeout(() => navigate('/login'), 5000);
    }
    if (isError) {
      setIsLoading(true);
      setTimeout(() => navigate('/forgot-password'), 5000);
    }
  }, [isSuccess, isError]);

  const sendResetPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
          password: password,
          email: searchParams.get('email'),
          token: searchParams.get('token'),
        }),
      });

      const { message } = await response.json();

      if (response.status === 400) {
        throw new Error(message);
      }

      setModalMessage(message);
      setIsSuccess(true);
    } catch (error) {
      setModalMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);
  const [isSuccessOpen, setIsSuccessOpen] = useToggleModal(isSuccess);

  const handlePasswordInput = (e) => setPassword(e.target.value);

  return (
    <section className="auth-section__form ">
      {isErrorOpen && (
        <ErrorModal message={modalMessage} setIsOpen={setIsErrorOpen} />
      )}
      {isSuccessOpen && (
        <SuccessModal message={modalMessage} setIsOpen={setIsSuccessOpen} />
      )}

      <h2 className="auth-form__title">Reset Password</h2>
      <form className="auth-form flex-col" onSubmit={sendResetPassword}>
        <label htmlFor="password"> New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordInput}
          autoComplete="off"
          placeholder="new password"
          required
        />
        <button className="btn--black" disabled={!validPassword || isLoading}>
          {isLoading ? <Loader color="#FFF" /> : 'Set New Password'}
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
