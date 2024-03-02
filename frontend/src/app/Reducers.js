import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  status: false,
};
const loginStatus = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
    },
    logout: (state, action) => {
      state.status = false;
    },
  },
});
export const { login, logout } = loginStatus.actions;
export default loginStatus.reducer;
