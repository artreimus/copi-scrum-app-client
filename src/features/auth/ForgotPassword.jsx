import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import useValidateEmail from '../../hooks/useValidateEmail';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

const ForgotPassword = () => {
  useTitle('Copi');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const validEmail = useValidateEmail(email);
  const [modalMessage, setModalMessage] = useState('');

  const sendForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ email }),
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

  const handleEmailInput = (e) => setEmail(e.target.value);

  return (
    <section className="auth-section__form">
      {isErrorOpen && (
        <ErrorModal message={modalMessage} setIsOpen={setIsErrorOpen} />
      )}
      {isSuccessOpen && (
        <SuccessModal message={modalMessage} setIsOpen={setIsSuccessOpen} />
      )}

      <h2 className="auth-form__title">Forgot Password</h2>
      <form className="auth-form flex-col" onSubmit={sendForgotPassword}>
        <label htmlFor="credential"> Email:</label>
        <input
          type="email"
          id="credential"
          name="credential"
          value={email}
          onChange={handleEmailInput}
          autoComplete="off"
          placeholder="email"
          required
        />
        <button className="btn--black" disabled={!validEmail || isLoading}>
          Reset Password
        </button>
      </form>
      <div className="center-all auth-form__container--link">
        <p>
          Don't have an account yet?
          <span>
            <Link to="/register" className="auth-form__link">
              Register
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
