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
};

export default chatbotService;
