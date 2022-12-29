import { useNavigate } from 'react-router-dom';

const Missing = () => {
  const navigate = useNavigate();

  return (
    <section className="center-all missing">
      <article className="center-all article__mising">
        <h2 className="article__mising__title">404</h2>
        <p className="article__mising__text">Ooops... Page not found</p>
        <button
          className="btn--blue article__missing__btn"
          onClick={() => navigate('/dash')}
        >
          Return to Dashboard
        </button>
      </article>
    </section>
  );
};

export default Missing;
