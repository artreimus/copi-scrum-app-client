import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import useValidateEmail from '../../hooks/useValidateEmail';

const ResetPassword = () => {
  useTitle('Copi');
  const [email, setEmail] = useState('');
  const validEmail = useValidateEmail(email);

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validEmail) {
      // change page
    }
  };

  const handleEmailInput = (e) => setEmail(e.target.value);

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  return (
    <section className="auth-section__form">
      <h2 className="auth-form__title">Reset Password</h2>
      <form className="auth-form flex-col" onSubmit={handleSubmit}>
        <label htmlFor="credential"> Email:</label>
        <input
          type="text"
          id="credential"
          name="credential"
          value={email}
          onChange={handleEmailInput}
          autoComplete="off"
          required
        />
        <button className="btn--black">Reset Password</button>
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
