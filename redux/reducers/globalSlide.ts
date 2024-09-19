import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

interface ModalPayload {
  type: "COMMENT" | "REACTION";
  props: any;
}

interface GlobalState {
  isLoading: boolean;
  modal: ModalPayload | null;
}

const initialState: GlobalState = {
  isLoading: true,
  modal: null,
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
    openModal(state, action: PayloadAction<ModalPayload>) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
  },
});

export const { loaded, loading, openModal, closeModal } = globalSlice.actions;
export default globalSlice.reducer;
