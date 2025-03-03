import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contractor: null,
};

const contractorSlice = createSlice({
  name: "contractor",
  initialState,
  reducers: {
    logincontractor: (state, action) => {
      console.log("user Data Received in Redux:", action.payload); 
      state.contractor = action.payload;
    },
    logoutcontractor: (state) => {
      state.contractor = null;
    },
  },
});

export const { logincontractor, logoutcontractor } = contractorSlice.actions;
export default contractorSlice.reducer;
