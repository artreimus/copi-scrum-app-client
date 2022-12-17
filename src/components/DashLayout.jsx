import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <main className="dash-container">
        <Outlet />
      </main>
    </>
  );
};

export default DashLayout;
