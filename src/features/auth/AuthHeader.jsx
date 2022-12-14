import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoLargeImage from '../../img/logo-large.svg';

const AuthHeader = () => {
  const navigate = useNavigate();
  const onLogoClicked = () => navigate('/');

  const content = (
    <header className="auth-header">
      <Link to="/" className="center-all auth-header__link">
        <div
          className="container__image auth-header__container--logo"
          onClick={onLogoClicked}
        >
          <img src={logoLargeImage} alt="Copi logo" />
        </div>
      </Link>
    </header>
  );

  return content;
};

export default AuthHeader;
