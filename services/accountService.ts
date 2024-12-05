import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, apiService, getApiConfig } from "./axios";
import { ACCOUNT_URL } from "./url";

const accountService = {
  async getAccount(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${ACCOUNT_URL.BASE}/${id}`, config);
  },
  async search(
    request: RequestInterfaces.ISearchAccountRequest,
    handleError?: (error?: any) => void
  ) {
    return apiService.post(ACCOUNT_URL.SEARCH, request, handleError);
  },
  async searchByPhoneNumbers(
    request: RequestInterfaces.ISearchAccountByPhoneNumbers
  ) {
    const config = await getApiConfig();
    return ApiInstance.post(
      ACCOUNT_URL.SEARCH_BY_PHONE_NUMBERS,
      request,
      config
    );
  },
  async becomeATeacher(request: RequestInterfaces.IEditAccountRequest) {
    return apiService.post(ACCOUNT_URL.BECOME_A_TEACHER, request);
  },
  async updateStatus(request: RequestInterfaces.IEditAccountStatusRequest) {
    return apiService.post(ACCOUNT_URL.UPDATE_STATUS, request);
  },
};

export default accountService;
