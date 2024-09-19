import { Interfaces } from "@/data/interfaces/model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
  account: Interfaces.IAccount | null;
}

const initialState: AuthState = {
  isLogin: false,
  account: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
    loadAccount(state, action: PayloadAction<Interfaces.IAccount>) {
      state.account = action.payload;
    },
  },
});

export const { login, logout, loadAccount } = authSlice.actions;
export default authSlice.reducer;
