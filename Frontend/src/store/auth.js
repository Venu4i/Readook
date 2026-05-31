import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isLoggedIn: !!localStorage.getItem("id"),
    role: localStorage.getItem("role") || "user",
    accessToken: localStorage.getItem("token") || null,
  },

  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.role = "user";

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
    },

    changeRole(state, action) {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },

    refreshToken(state, action) {
      state.accessToken = action.payload;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;