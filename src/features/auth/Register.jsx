import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useRegisterMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

const Register = () => {
  useTitle('Copi');
  const emailRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, email, password });

    try {
      // unwrap to use trycatch instead of using rtk's error/isError
      await register({ username, email, password }).unwrap();
      setPersist(true);
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  if (isLoading) return <PulseLoader color={'#FFF'} />;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Email:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={emailRef}
            value={email}
            onChange={handleEmailInput}
            autoComplete="off"
            required
          />
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Register</button>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Register;
