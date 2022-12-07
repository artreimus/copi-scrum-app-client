import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = 'Employee';

  if (token) {
    const decode = jwtDecode(token);
    const { username, roles, userId } = decode.user;

    isManager = roles?.includes('Manager');
    isAdmin = roles?.includes('Admin');

    // Admin is the highest role
    if (isManager) status = 'Manager';
    if (isAdmin) status = 'Admin';

    return { username, roles, isManager, isAdmin, status, userId };
  }

  return { username: '', roles: [], isManager, isAdmin, status, userId: '' };
};

export default useAuth;
