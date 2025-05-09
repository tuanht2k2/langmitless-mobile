import { RequestInterfaces } from "@/data/interfaces/request";
import { CREDIT_CARD_URL } from "./url";
import { apiService } from "./axios";

const creditCardService = {
  async create(
    request: RequestInterfaces.IEditCreditCardRequest,
    handleError?: (error?: any) => void
  ) {
    try {
      const formData = new FormData();
      formData.append("cardNumber", request.cardNumber || "");
      formData.append("accountId", request.accountId || "");
      formData.append("bank", request.bank || "");
      formData.append("qrImage", request.qrImage);

      return apiService.postForm(CREDIT_CARD_URL.CREATE, formData, handleError);
    } catch (error) {
      handleError?.();
    }
  },
  async getDetails(handleError?: (error?: any) => void) {
    try {
      return apiService.post(CREDIT_CARD_URL.DETAILS, null, handleError);
    } catch (error) {
      handleError?.();
    }
  },
};

export default creditCardService;
