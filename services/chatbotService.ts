import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { CHATBOT_URL } from "./url";

const chatbotService = {
  async getResponse(request: RequestInterfaces.IChatBotRequest) {
    try {
      return apiService.post(CHATBOT_URL.GET_RESPONSE, request);
    } catch (error) {
      throw error;
    }
  },
};

export default chatbotService;
