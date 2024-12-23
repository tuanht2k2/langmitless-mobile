import { ResponseInterfaces } from "@/data/interfaces/response";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isLoading: boolean;
  isOverlayLoading: boolean;
  hireNotification: ResponseInterfaces.IHireResponse | null;
  chatbotVisible: boolean;
}

const initialState: GlobalState = {
  isLoading: true,
  isOverlayLoading: false,
  hireNotification: null,
  chatbotVisible: true,
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
    overlayLoaded(state) {
      state.isOverlayLoading = false;
    },
    overlayLoading(state) {
      state.isOverlayLoading = true;
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
    showChatbot(state) {
      state.chatbotVisible = true;
    },
    hideChatbot(state) {
      state.chatbotVisible = false;
    },
  },
});

export const {
  loaded,
  loading,
  overlayLoaded,
  overlayLoading,
  noticeHired,
  clearHired,
} = globalSlice.actions;
export default globalSlice.reducer;
