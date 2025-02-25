import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";

const userstore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default userstore;
