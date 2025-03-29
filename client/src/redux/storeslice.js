import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    loginstore: (state, action) => {
      console.log("store Data Received in Redux:", action.payload); 
      state.store = action.payload;
    },
    logoutstore: (state) => {
      state.store = null;
    },
  },
});

export const { loginstore, logoutstore } = storeSlice.actions;
export default storeSlice.reducer;
