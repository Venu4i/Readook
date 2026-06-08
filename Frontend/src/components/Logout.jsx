import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth.js';
import axiosInstance from '../store/axios.js';

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      await axiosInstance.post('/user/logout', null, {
        withCredentials: true, // if cookies are used
      });

      
      dispatch(authActions.logout());
      dispatch(authActions.changeRole(null));

     
      localStorage.clear();

      // Redirect to login or homepage
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err?.response?.data?.message || err.message);
    }
  };

  return handleLogout;
}
