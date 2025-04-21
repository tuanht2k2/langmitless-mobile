import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { CHATBOT_URL } from "./url";

const chatbotService = {
  async ask(message: string) {
    try {
      return apiService.post(CHATBOT_URL.ASK, { message });
    } catch (error) {
      throw error;
    }
  },
  async askAbountCourse(request: RequestInterfaces.IAskAboutCourseRequest) {
    try {
      return apiService.post(CHATBOT_URL.ASK_ABOUT_COURSE, request);
    } catch (error) {
      throw error;
    }
  },
};

export default chatbotService;
