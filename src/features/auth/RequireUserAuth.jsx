import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireUserAuth = () => {
  const location = useLocation();
  const { userId } = useAuth();
  let content;

  if (!userId) {
    content = <Navigate to={'/login'} state={{ from: location }} replace />;
  } else {
    content = <Outlet />;
  }

  return content;
};

export default RequireUserAuth;
