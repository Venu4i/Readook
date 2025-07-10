import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth.js';

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Logout failed');
      }

      // Clear Redux state
      dispatch(authActions.logout());
      dispatch(authActions.changeRole(null));

      // Redirect to login or homepage
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return handleLogout;
}
