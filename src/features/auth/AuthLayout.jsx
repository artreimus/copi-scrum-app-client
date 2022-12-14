import { Outlet } from 'react-router-dom';
import AuthHeader from './AuthHeader';

const AuthLayout = () => {
  return (
    <>
      <AuthHeader />
      <main className="auth-layout center-all">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
