import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { PAYMENT_URL } from "./url";

const paymentService = {
  async create(
    request: RequestInterfaces.IEditPaymentRequest,
    handleError?: (error?: any) => void
  ) {
    try {
      return apiService.post(PAYMENT_URL.CREATE, request, handleError);
    } catch (error) {
      handleError?.();
    }
  },
};

export default paymentService;
