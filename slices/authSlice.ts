import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const initialState: types.IAuth = {
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",
  firstName: "",
  lastName: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<types.IAuth>) => {
      state.isLoggedIn = true,
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    logout: (state) => {
      state.isLoggedIn = false,
      state.accessToken = "";
      state.refreshToken = "";
      state.firstName = "";
      state.lastName = "";
    },
    updateToken: (state, action: PayloadAction<types.IAuth>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken
    },
  },
});

export const { login, logout, updateToken } = authSlice.actions;

export const getIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const getAccessToken = (state: RootState) => state.auth.accessToken;
export const getRefreshToken = (state: RootState) => state.auth.refreshToken;
export const getFirstName = (state: RootState) => state.auth.firstName;
export const getLastName = (state: RootState) => state.auth.lastName;

export default authSlice.reducer;
