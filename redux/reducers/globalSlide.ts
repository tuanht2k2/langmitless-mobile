import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isLoading: boolean;
  account: string;
}

const initialState: GlobalState = {
  isLoading: true,
  account: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    loaded(state) {
      state.isLoading = false;
    },
    loading(state) {
      state.isLoading = true;
    },
  },
});

export const { loaded, loading } = globalSlice.actions;
export default globalSlice.reducer;
