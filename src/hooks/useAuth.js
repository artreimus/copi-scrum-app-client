import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decode = jwtDecode(token);

    return { ...decode.user };
  }

  return { username: '', userId: '', email: '' };
};

export default useAuth;
