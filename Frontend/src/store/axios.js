import axios from "axios";
import store from "../store";
import { authActions } from "../store/auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", 
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Attach the current token to every request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: Handle 401s by refreshing the token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the server returns 401 (Unauthorized) and we haven't retried this specific request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // We get the user ID from localStorage to help the backend identify the user if needed
        const userId = localStorage.getItem("id");

        // ✅ Perform the refresh token call
        // We use 'axios' (the base library) here to avoid triggering this interceptor again
        const res = await axios.post(
          "http://localhost:3000/api/v1/user/refresh-token", 
          { userId }, // Passing ID in body just in case your backend needs it
          { withCredentials: true }
        );

        // Extract the new token (Adjust path to res.data.data.accessToken if needed)
        const newAccessToken = res.data.accessToken || res.data.data?.accessToken;

        if (!newAccessToken) throw new Error("No token received");

        // 1. Sync LocalStorage
        localStorage.setItem("token", newAccessToken);

        // 2. Sync Redux (Prevents UI from switching to 'Logged Out' state)
        store.dispatch(authActions.refreshToken(newAccessToken));

        // 3. Update the failed request's header and retry it
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        console.error("Refresh Token Expired or Invalid:", err);

        // ✅ If refresh fails, then and ONLY then do we wipe the session
        localStorage.clear();
        store.dispatch(authActions.logout());
        
        // Redirect to prevent the user from seeing private dashboards
        if (window.location.pathname !== "/") {
            window.location.href = "/";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;