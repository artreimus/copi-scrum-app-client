import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';
import useValidateUsername from '../../hooks/useValidateUsername';
import useValidateEmail from '../../hooks/useValidateEmail';
import useValidatePassword from '../../hooks/useValidatePassword';
import ErrorModal from '../../components/ErrorModal';
import useToggleModal from '../../hooks/useToggleModal';

const Register = () => {
  useTitle('Copi');
  const emailRef = useRef();
  const [username, setUsername] = useState('');
  const validUsername = useValidateUsername(username);
  const [email, setEmail] = useState('');
  const validEmail = useValidateEmail(email);
  const [password, setPassword] = useState('');
  const validPassword = useValidatePassword(password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [canSave, setCanSave] = useState(false);
  const [, setPersist] = usePersist();

  const [register, { isSuccess, isLoading, isError, error }] =
    useRegisterMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal(isError);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setCanSave(
      confirmPassword === password &&
        validUsername &&
        validEmail &&
        validPassword &&
        !isLoading
    );
  }, [validUsername, validEmail, validPassword, confirmPassword]);

  useEffect(() => {
    if (isSuccess) {
      setPersist(true); // keep user logged in
      navigate('/dash');
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      await register({ username, email, password });
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e) => setConfirmPassword(e.target.value);

  return (
    <section className="auth-section__form">
      {isErrorOpen && (
        <ErrorModal message={error?.data?.message} setIsOpen={setIsErrorOpen} />
      )}
      <h2 className="auth-form__title">Register</h2>
      <form className="auth-form flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          style={{
            borderColor: !email ? 'black ' : validEmail ? 'black' : 'red',
          }}
          type="email"
          id="email"
          name="email"
          ref={emailRef}
          value={email}
          onChange={handleEmailInput}
          placeholder="email@example.com"
          autoComplete="off"
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUserInput}
          autoComplete="off"
          minLength="3"
          maxLength="30"
          placeholder="3-30 characters and consist only of letters"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={handlePwdInput}
          value={password}
          minLength="6"
          maxLength="100"
          placeholder="6-100 characeters. Special characters !@#$% are allowed"
          required
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          onChange={handleConfirmPwdInput}
          value={confirmPassword}
          placeholder="confirm password"
          minLength="6"
          maxLength="100"
          required
        />
        <button className="btn--black" disabled={!canSave}>
          Register
        </button>
        <div className="center-all auth-form__container--link">
          <p>
            Already have an account ?
            <span>
              <Link to="/login" className="auth-form__link">
                Login
              </Link>
            </span>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Register;
