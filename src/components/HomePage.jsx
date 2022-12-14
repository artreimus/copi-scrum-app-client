import useTitle from '../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import logoImage from '../img/logo-sm.png';
import notesImage from '../img/notes.png';

const HomePage = () => {
  useTitle('Copi');

  const navigate = useNavigate();

  const onSignupBtnClicked = () => {
    navigate('./register');
  };

  const onLoginBtnClicked = () => {
    navigate('./login');
  };

  const onGoToAppBtnClicked = () => {
    navigate('./dash');
  };
  const content = (
    <>
      <header className="home-header">
        <div className="center-all">
          <button className="btn--auth" onClick={onSignupBtnClicked}>
            sign up
          </button>
          <button className="btn--auth" onClick={onLoginBtnClicked}>
            login
          </button>
        </div>
      </header>
      <main className="home-main flex-row">
        <div className="home-main__container--primary flex-col">
          <div className="container__image home-main__container--logo">
            <img src={logoImage} alt="Copi Logo" className="home-main__logo" />
          </div>
          <p className="home-main__text text--blue">
            The scrum app that can help your team be more organized and
            efficient
          </p>
          <button
            className="home-main__btn--blue btn--blue"
            onClick={onGoToAppBtnClicked}
          >
            Go to App
          </button>
        </div>
        <div className="flex-col home-main__container--secondary">
          <div className="container--image display-lg--visible">
            <img src={notesImage} alt="Copi Logo" />
          </div>
        </div>
      </main>
    </>
  );

  return content;
};

export default HomePage;
