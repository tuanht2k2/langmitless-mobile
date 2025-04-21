import { ResponseInterfaces } from "@/data/interfaces/response";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isLoading: boolean;
  isOverlayLoading: boolean;
  hireNotification: ResponseInterfaces.IHireResponse | null;
  chatbotVisible: boolean;
  course: ResponseInterfaces.ICourseResponse | null;
}

const initialState: GlobalState = {
  isLoading: true,
  isOverlayLoading: false,
  hireNotification: null,
  chatbotVisible: false,
  course: null,
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
    askChatbotAboutCourse(
      state,
      action: PayloadAction<ResponseInterfaces.ICourseResponse>
    ) {
      state.chatbotVisible = true;
      state.course = action.payload;
    },
    clearCourse(state) {
      state.course = null;
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
  askChatbotAboutCourse,
  clearCourse,
  showChatbot,
  hideChatbot,
} = globalSlice.actions;
export default globalSlice.reducer;
