import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import globalSlide from "./reducers/globalSlide";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalSlide,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
