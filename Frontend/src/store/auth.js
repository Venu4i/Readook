import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // DO NOT start at false/null. Read from storage immediately.
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
    },
    changeRole(state, action) {
      state.role = action.payload;
    },
    refreshToken(state, action) {
      state.accessToken = action.payload; // updated access token
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
