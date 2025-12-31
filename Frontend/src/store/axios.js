// store/axios.js
import axios from "axios";
import store from "../store";
import { authActions } from "../store/auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", 
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect 401 and ensure we aren't already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/refresh-token", {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        // Update local storage so App.jsx stays in sync
        localStorage.setItem("token", newAccessToken);

        store.dispatch(authActions.refreshToken(newAccessToken));

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh token is expired/invalid, clear everything
        localStorage.clear();
        store.dispatch(authActions.logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(config => {
  // Always check localStorage as the "Source of Truth" if Redux is empty
  const token = store.getState().auth.accessToken || localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;