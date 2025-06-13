import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginuser: (state, action) => {
      state.user = action.payload;
    },
    logoutuser: (state) => {
      state.user = null;
    },
  },
});

export const { loginuser, logoutuser } = userSlice.actions;
export default userSlice.reducer;
