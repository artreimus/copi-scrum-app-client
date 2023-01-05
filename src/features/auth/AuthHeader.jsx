import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImage from '../../img/logo-sm.png';

const AuthHeader = () => {
  const navigate = useNavigate();

  const content = (
    <header className="auth-header">
      <Link to="/" className="center-all auth-header__link">
        <div className="container__image auth-header__container--logo">
          <img src={logoImage} alt="Copi logo" />
        </div>
      </Link>
    </header>
  );

  return content;
};

export default AuthHeader;
