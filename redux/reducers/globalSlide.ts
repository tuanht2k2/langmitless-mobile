import { ResponseInterfaces } from "@/data/interfaces/response";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

interface ModalPayload {
  type: "COMMENT" | "REACTION";
  props: any;
}

interface GlobalState {
  isLoading: boolean;
  modal: ModalPayload | null;
  hireNotification: ResponseInterfaces.IHireResponse | null;
}

const initialState: GlobalState = {
  isLoading: true,
  modal: null,
  hireNotification: null,
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
    noticeHired(
      state,
      action: PayloadAction<ResponseInterfaces.IHireResponse>
    ) {
      state.hireNotification = action.payload;
    },
    clearHired(state) {
      state.hireNotification = null;
    },
  },
});

export const {
  loaded,
  loading,
  openModal,
  closeModal,
  noticeHired,
  clearHired,
} = globalSlice.actions;
export default globalSlice.reducer;
