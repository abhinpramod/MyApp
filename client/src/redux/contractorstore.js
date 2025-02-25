import { configureStore } from "@reduxjs/toolkit";
import contractorReducer from "./contractorslice";

const contractorstore = configureStore({
  reducer: {
    contractor: contractorReducer,
  },
});

export default contractorstore;
