import axios from "axios";
import store from "../store";
import { authActions } from "../store/auth";

const axiosInstance = axios.create({
  baseURL: "https://readook.onrender.com/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        //console.log("REFRESH TOKEN CALLED");

        const refreshResponse = await axios.post(
          "https://readook.onrender.com/api/v1/user/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        localStorage.setItem(
          "token",
          newAccessToken
        );

        store.dispatch(
          authActions.refreshToken(newAccessToken)
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {

        localStorage.clear();

        store.dispatch(
          authActions.logout()
        );

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;