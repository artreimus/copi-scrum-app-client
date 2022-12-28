import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import useValidateEmail from '../../hooks/useValidateEmail';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

const ResetPassword = () => {
  useTitle('Copi');
  const [email, setEmail] = useState('');
  const validEmail = useValidateEmail(email);

  const [login, { isSuccess, isLoading, isError, error }] = useLoginMutation();
  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);
  const [isSuccessOpen, setIsSuccessOpen] = useToggleModal(isSuccess);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validEmail) {
      // change message
    }
  };

  const handleEmailInput = (e) => setEmail(e.target.value);

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  return (
    <section className="auth-section__form">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      {isSuccessOpen && (
        <SuccessModal
          message={
            'Please check your email for the instructions on how to reset your password'
          }
          setIsOpen={setIsSuccessOpen}
        />
      )}

      <h2 className="auth-form__title">Reset Password</h2>
      <form className="auth-form flex-col" onSubmit={handleSubmit}>
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
        <button className="btn--black" disabled={!validEmail}>
          Reset Password
        </button>
      </form>
      <div className="center-all auth-form__container--link">
        <p>
          Return to
          <span>
            <Link to="/register" className="auth-form__link">
              Login
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
