import { Interfaces } from "@/data/interfaces/model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
  user: Interfaces.IAccount | null;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<Interfaces.IAccount>) {
      state.isLogin = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
