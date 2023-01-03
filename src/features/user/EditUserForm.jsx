import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import useValidateUsername from '../../hooks/useValidateUsername';
import useValidateEmail from '../../hooks/useValidateEmail';
import useValidatePassword from '../../hooks/useValidatePassword';
import InfoIcon from '../../components/InfoIcon';
import useToggleModal from '../../hooks/useToggleModal';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../auth/authSlice';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageEdit
);

const EditUserForm = ({ user }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [username, setUsername] = useState(user.username);
  const validUsername = useValidateUsername(username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const validPassword = useValidatePassword(newPassword);
  const [email, setEmail] = useState(user.email ?? '');
  const validEmail = useValidateEmail(email);
  const [canSave, setCanSave] = useState(false);

  const [images, setImages] = useState([]);
  const token = useSelector(selectCurrentToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [isErrorOpen, setIsErrorOpen] = useToggleModal();
  const [isSuccessOpen, setIsSuccessOpen] = useToggleModal(isSuccess);

  useEffect(() => {
    if (newPassword) {
      setCanSave(
        [validUsername, validEmail, validPassword].every(Boolean) && !isLoading
      );
    } else {
      setCanSave([validUsername, validEmail].every(Boolean) && !isLoading);
    }
  }, [validUsername, validEmail, validPassword, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      setOldPassword('');
      setNewPassword('');
    }
  }, [isSuccess, navigate]);

  const uploadImageFile = async () => {
    const formData = new FormData();
    formData.append('image', images[0].file);

    const response = await fetch('/api/v1/users/uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 400) {
      throw new Error('Error uploading file');
    }

    return response.json();
  };

  const onEmailChanged = (e) => setEmail(e.currentTarget.value);
  const onUsernameChanged = (e) => setUsername(e.currentTarget.value);
  const onOldPasswordChanged = (e) => setOldPassword(e.currentTarget.value);
  const onNewPasswordChanged = (e) => setNewPassword(e.currentTarget.value);

  const onSaveUserClicked = async (e) => {
    try {
      if (canSave) {
        setCanSave(false);
        const userInfo = {
          username,
          email,
        };

        if (images.length) {
          const { image } = await uploadImageFile();
          userInfo.image = image.src;
        }
        if (newPassword && oldPassword) {
          userInfo.oldPassword = oldPassword;
          userInfo.newPassword = newPassword;
        }
        const { accessToken } = await updateUser({ userInfo }).unwrap();
        dispatch(setCredentials({ accessToken }));
      }
    } catch (error) {
      if (error.data?.message) {
        setErrorMsg(error?.data?.message);
      } else {
        setErrorMsg(error.message);
      }
      setIsErrorOpen(true);
    } finally {
      setCanSave(true);
    }
  };

  const content = (
    <>
      {isErrorOpen && (
        <ErrorModal message={errorMsg} setIsOpen={setIsErrorOpen} />
      )}
      {isSuccessOpen && (
        <SuccessModal
          message={'Credentials updated'}
          setIsOpen={setIsSuccessOpen}
        />
      )}

      <form
        className="user-profile__main user-profile__main-edit flex-col"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="section__title user-profile__title">Edit Profile</h3>
        <div className="center-all">
          <FilePond
            files={images}
            onupdatefiles={setImages}
            allowMultiple={false}
            instantUpload={false}
            // server={{
            //   process: {
            //     url: '/api/v1/users/uploads',
            //     // url: null,
            //     headers: {
            //       Authorization: `Bearer ${token}`,
            //     },
            //     onload: (result) => {
            //       console.log(result);
            //       setImageSrc(JSON.parse(result).image.src);
            //     },
            //   },
            // }}
            // name="image"
            labelIdle='Drag and drop your files or <span class="filepond--label-action">Browse</span>'
            imagePreviewHeight={170}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*']}
            allowImageCrop={true}
            imageCropAspectRatio="1:1"
            allowImageResize={true}
            imageResizeTargetWidth={200}
            imageResizeTargetHeight={200}
            stylePanelLayout="compact circle"
          />
        </div>
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
    </>
  );

  return content;
};

export default EditUserForm;
