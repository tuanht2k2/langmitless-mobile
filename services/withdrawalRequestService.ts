import { RequestInterfaces } from "@/data/interfaces/request";
import { WITHDRAWAL_REQUEST_URL } from "./url";
import { apiService } from "./axios";

const withdrawalRequestService = {
  async create(
    request: RequestInterfaces.IEditWithdrawalRequest,
    handleError?: (error?: any) => void
  ) {
    try {
      return apiService.post(
        WITHDRAWAL_REQUEST_URL.CREATE,
        request,
        handleError
      );
    } catch (error) {
      handleError?.();
    }
  },
  async updateStatus(
    request: RequestInterfaces.IEditWithdrawalRequest,
    handleError?: (error?: any) => void
  ) {
    try {
      return apiService.post(
        WITHDRAWAL_REQUEST_URL.UPDATE_STATUS,
        request,
        handleError
      );
    } catch (error) {
      handleError?.();
    }
  },
};

export default withdrawalRequestService;
