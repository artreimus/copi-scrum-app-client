import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import useValidateEmail from '../../hooks/useValidateEmail';
import ErrorModal from '../../components/ErrorModal';
import useToggleModal from '../../hooks/useToggleModal';

const Login = () => {
  useTitle('Copi');
  const userRef = useRef();
  const [credential, setCredential] = useState('');
  const validEmail = useValidateEmail(credential);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [isOpen, setIsOpen] = useToggleModal(isError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, [credential, password]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/dash');
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = validEmail
      ? {
          email: credential,
          password,
        }
      : {
          username: credential,
          password,
        };
    try {
      const { accessToken } = await login(userInfo).unwrap();
      dispatch(setCredentials({ accessToken }));
    } catch (err) {
      if (!err.status) {
        setErrorMsg('No Server Response');
      } else if (err.status === 400) {
        setErrorMsg('Invalid credentials');
      } else if (err.status === 401) {
        setErrorMsg('Unauthorized');
      }
    }
  };

  const handleUserInput = (e) => setCredential(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  if (isLoading) return <PulseLoader color={'#FFF'} />;
  return (
    <section className="auth-section__form">
      {isOpen && (
        <ErrorModal message={error.data.message} setIsOpen={setIsOpen} />
      )}
      <h2 className="auth-form__title">Login</h2>
      <form className="auth-form flex-col" onSubmit={handleSubmit}>
        <label htmlFor="credential">Username or Email:</label>
        <input
          type="text"
          id="credential"
          name="credential"
          ref={userRef}
          value={credential}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={handlePwdInput}
          value={password}
          required
        />
        <div>
          <label htmlFor="persist" className="auth-toggle__label">
            <input
              className="auth-toggle__checkbox"
              type="checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Remember me
          </label>
        </div>
        <button className="btn--black">Sign In</button>
      </form>
      <div className="center-all auth-form__container--link">
        <p>
          Forgot your password?
          <span>
            <Link to="/reset-password" className="auth-form__link">
              Reset Password
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
