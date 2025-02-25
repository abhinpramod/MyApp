import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractor: null,
};

const contractorSlice = createSlice({
  name: "contractor",
  initialState,
  reducers: {
    loginuser: (state, action) => {
      console.log("user Data Received in Redux:", action.payload); 
      state.contractor = action.payload;
    },
    logoutuser: (state) => {
      state.contractor = null;
    },
  },
});

export const { logincontractor, logoutcontractor } = contractorSlice.actions;
export default contractorSlice.reducer;
