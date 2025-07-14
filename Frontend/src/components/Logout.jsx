import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth.js';
import axiosInstance from '../store/axios.js';

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post('/user/logout', {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Logout failed');
      }
      else{

      // Clear Redux state
      dispatch(authActions.logout());
      dispatch(authActions.changeRole(null));

      // Redirect to login or homepage
      navigate('/');
      }
      
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return handleLogout;
}
