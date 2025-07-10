import axios from "axios";
import store from "../store";
import { authActions } from "../store/auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // update as needed
  withCredentials: true, // send cookies (refresh token)
});

// Add interceptor for handling expired token
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh token endpoint
        const res = await axios.get("http://localhost:8000/users/refresh-token", {
          withCredentials: true, // must include cookies
        });

        const newAccessToken = res.data.accessToken;

        // update Redux state
        store.dispatch(authActions.refreshToken(newAccessToken));

        // update header and retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(authActions.logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
