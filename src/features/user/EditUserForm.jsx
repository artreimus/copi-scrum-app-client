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
import InfoIcon from '../../components/InfoIcon';

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
    <form
      className="user-profile__main user-profile__main-edit flex-col"
      onSubmit={(e) => e.preventDefault()}
    >
      <h3 className="section__title user-profile__title">Edit Profile</h3>
      <div className="flex-col user-profile__container user-profile__container--info user-profile__container--info-edit">
        <div className="flex-row user-profile__container-label">
          <label htmlFor="username" className="user-profile__info__label">
            Username
          </label>
          <InfoIcon msg={'3-30 characters and consist only of letters'} />
        </div>
        <input
          className="user-profile__info__input"
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          minLength="3"
          maxLength="30"
          onChange={onUsernameChanged}
        />
      </div>
      <div className="flex-col user-profile__container user-profile__container--info user-profile__container--info-edit">
        <div className="flex-row user-profile__container-label">
          <label htmlFor="email" className="user-profile__info__label">
            Email
          </label>
        </div>
        <input
          className="user-profile__info__input"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onEmailChanged}
        />
      </div>

      <div className="flex-col user-profile__container user-profile__container--info user-profile__container--info-edit">
        <div className="flex-row user-profile__container-label">
          <label htmlFor="oldPassword" className="user-profile__info__label">
            Old Password <span></span>
          </label>
          <InfoIcon msg={'Leave blank to not change password'} />
        </div>

        <input
          className="user-profile__info__input"
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={oldPassword}
          onChange={onOldPasswordChanged}
        />
      </div>
      <div className="flex-col user-profile__container user-profile__container--info user-profile__container--info-edit">
        <div className="flex-row user-profile__container-label">
          <label htmlFor="newPassword" className="user-profile__info__label">
            New Password
          </label>

          <InfoIcon
            msg={'6-100 characters. Special characters !@#$% are allowed'}
          />
        </div>

        <input
          className="user-profile__info__input"
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={onNewPasswordChanged}
          minLength={newPassword && 6}
          maxLength="100"
        />
      </div>

      <button
        className="btn--blue user-profile__btn"
        title="save"
        onClick={onSaveUserClicked}
        disabled={!canSave}
      >
        save
      </button>
    </form>
  );

  return content;
};

export default EditUserForm;
