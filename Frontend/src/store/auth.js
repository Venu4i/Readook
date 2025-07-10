import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    accessToken: null,
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
