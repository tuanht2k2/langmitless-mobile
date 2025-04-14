import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { OTP_URL } from "./url";

const questionService = {
  async get() {
    try {
      return apiService.post(OTP_URL.GET, null);
    } catch (error) {
      throw error;
    }
  },
  async verify(request: RequestInterfaces.IOtpRequest) {
    try {
      return apiService.post(OTP_URL.VERIFY, request);
    } catch (error) {
      throw error;
    }
  },
};

export default questionService;
