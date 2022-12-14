import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import useValidateUsername from '../../hooks/useValidateUsername';
import useValidateEmail from '../../hooks/useValidateEmail';
import useValidatePassword from '../../hooks/useValidatePassword';

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user.username);
  const validUsername = useValidateUsername(username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const validPassword = useValidatePassword(newPassword);
  const [email, setEmail] = useState(user.email ?? '');
  const validEmail = useValidateEmail(email);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    if (newPassword) {
      setCanSave(
        [validUsername, validEmail, validPassword].every(Boolean) && !isLoading
      );
    } else {
      setCanSave([validUsername, validEmail].every(Boolean) && !isLoading);
    }
  }, [validUsername, validEmail, validPassword]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/dash/user');
    }
  }, [isSuccess, navigate]);

  const onEmailChanged = (e) => setEmail(e.currentTarget.value);
  const onUsernameChanged = (e) => setUsername(e.currentTarget.value);
  const onOldPasswordChanged = (e) => setOldPassword(e.currentTarget.value);
  const onNewPasswordChanged = (e) => setNewPassword(e.currentTarget.value);

  const onSaveUserClicked = async (e) => {
    try {
      if (canSave) {
        if (newPassword && oldPassword) {
          const { accessToken } = await updateUser({
            userId: user._id,
            userInfo: {
              username,
              email,
              oldPassword,
              newPassword,
            },
          }).unwrap();
          dispatch(setCredentials({ accessToken }));
        } else {
          const { accessToken } = await updateUser({
            userId: user._id,
            userInfo: {
              username,
              email,
            },
          }).unwrap();
          dispatch(setCredentials({ accessToken }));
        }
      }
    } catch (error) {}
  };

  const content = (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h2>Edit User</h2>
        </div>
        <label htmlFor="username">
          Username: <span>[3-20 letters]</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        <label htmlFor="oldPassword">
          Old Password: <span>[empty = no change]</span>{' '}
          <span>[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={oldPassword}
          onChange={onOldPasswordChanged}
        />{' '}
        <label htmlFor="newPassword">
          New Passwordassword: <span>[empty = no change]</span>{' '}
          <span>[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={onNewPasswordChanged}
        />{' '}
        <label htmlFor="email">
          Email: <span>[empty = no change]</span>{' '}
          <span>[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onEmailChanged}
        />
        <button title="save" onClick={onSaveUserClicked} disabled={!canSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
