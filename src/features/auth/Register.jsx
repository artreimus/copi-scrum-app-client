import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import useValidateUsername from '../../hooks/useValidateUsername';
import useValidateEmail from '../../hooks/useValidateEmail';
import useValidatePassword from '../../hooks/useValidatePassword';

const Register = () => {
  useTitle('Copi');
  const emailRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const validUsername = useValidateUsername(username);
  const [email, setEmail] = useState('');
  const validEmail = useValidateEmail(email);
  const [password, setPassword] = useState('');
  const validPassword = useValidatePassword(password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [canSave, setCanSave] = useState(false);
  const [, setPersist] = usePersist();

  const [register, { isSuccess, isLoading, isError, error }] =
    useRegisterMutation();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, [username, password]);

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
      try {
        // unwrap to use trycatch instead of using rtk's error/isError
        await register({ username, email, password }).unwrap();
      } catch (err) {
        setErrorMsg('Unauthorized');
        errRef.current.focus();
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e) => setConfirmPassword(e.target.value);

  const errorClass = errorMsg ? 'show' : 'hidden';

  if (isLoading) return <PulseLoader color={'#FFF'} />;

  return (
    <section className="auth-section__form">
      <p ref={errRef} className={errorClass} aria-live="assertive">
        {errorMsg}
      </p>
      <h2 className="auth-form__title">Register</h2>
      <form className="auth-form flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
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
          placeholder="3-20 characters and consist only of letters"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={handlePwdInput}
          value={password}
          placeholder="4-12 characeters including !@#$%"
          required
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          onChange={handleConfirmPwdInput}
          value={confirmPassword}
          placeholder="confirm password"
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
