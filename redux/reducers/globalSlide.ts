import { ResponseInterfaces } from "@/data/interfaces/response";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isLoading: boolean;
  isOverlayLoading: boolean;
  hireNotification: ResponseInterfaces.IHireResponse | null;
  chatbotVisible: boolean;
  chatbotButtonVisible: boolean;
  messengerVisible: boolean;
  messengerButtonVisible: boolean;
  messengerId: string;
  course: ResponseInterfaces.ICourseResponse | null;
}

const initialState: GlobalState = {
  isLoading: true,
  isOverlayLoading: false,
  hireNotification: null,
  chatbotVisible: false,
  chatbotButtonVisible: false,
  messengerButtonVisible: false,
  messengerVisible: false,
  messengerId: "",
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
      state.chatbotButtonVisible = true;
    },
    hideChatbotButton(state) {
      state.chatbotButtonVisible = false;
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
    showMessenger(state) {
      state.messengerVisible = true;
    },

    hideMessengerButton(state) {
      state.messengerButtonVisible = false;
    },
    hideMessenger(state) {
      state.messengerVisible = false;
      state.messengerId = "";
      state.messengerButtonVisible = true;
    },
    openMessenger(state, action: PayloadAction<string>) {
      state.messengerId = action.payload;
      state.messengerVisible = true;
    },
    closeMessenger(state) {
      state.messengerId = "";
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
  showMessenger,
  hideMessenger,
  openMessenger,
  closeMessenger,
  hideChatbotButton,
  hideMessengerButton,
} = globalSlice.actions;
export default globalSlice.reducer;
