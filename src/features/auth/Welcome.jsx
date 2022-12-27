import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const Welcome = () => {
  useTitle('Copi');
  const { username, isManager, isAdmin } = useAuth();

  const navigate = useNavigate();

  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);

  const content = (
    <section className="welcome">
      <div className="section__header">
        <h2 className="section__title section__header__title">
          Welcome {username}
        </h2>
      </div>
      <div>
        <p></p>
      </div>

      <div className="welcome-item">
        <p className="welcome-item__text">
          Welcome to the Scrum app! This tool is designed to help your team stay
          organized and efficient as you work towards your goals.
        </p>
        <p className="welcome-item__text">
          To get started, let's create a board for your sprints. A sprint is a
          set period of time during which your team focuses on completing a
          specific set of tasks. Give your board a name (e.g. "Sprint 1"), add a
          brief description of what your team will be working on during this
          sprint, and specify the target start and end dates. You can also add
          admins and regular users to your board to help manage and collaborate
          on tasks.
        </p>
        <p className="welcome-item__text">
          Now it's time to add some notes to your board. These notes represent
          the individual tasks that need to be completed during the sprint. Give
          your note a title and a brief description of what needs to be done,
          and specify the start and end dates for the task. You can also assign
          the task to specific users and choose a status for the task from the
          following options: "To Do," "In Progress," "Testing," and "Done." As
          you work on each task, simply click on the note and change its status
          to reflect its current status. By using the Scrum app to keep track of
          your tasks and their statuses, you'll be able to see at a glance what
          needs to be done, who is working on what, and what has been completed.
          This will help your team stay organized and efficient as you work
          towards your goals.
        </p>
        <div className="center-all">
          <button
            className="btn--blue welcome__btn"
            onClick={() => navigate('/dash/boards')}
          >
            Go to Boards
          </button>
          <button
            className="btn--blue welcome__btn"
            onClick={() => navigate('/dash/notes')}
          >
            Go to My notes
          </button>
        </div>
      </div>
    </section>
  );

  return content;
};

export default Welcome;
