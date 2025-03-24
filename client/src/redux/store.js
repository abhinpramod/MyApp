import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import contractorReducer from "./contractorslice";
import storeReducer from "./storeslice";

const store = configureStore({
  reducer: {
    user: userReducer,
    contractor: contractorReducer,
    store:storeReducer
  },
});

export default store;
