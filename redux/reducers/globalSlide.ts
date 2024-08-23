import { Interfaces } from "@/data/interfaces/model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isLoading: boolean;
}

const initialState: GlobalState = {
  isLoading: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleLoading(state, action: PayloadAction<any>) {
      state.isLoading = !state.isLoading;
    },
  },
});

export const { toggleLoading } = globalSlice.actions;
export default globalSlice.reducer;
