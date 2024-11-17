import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { ACCOUNT_URL } from "./url";

const accountService = {
  async getAccount(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${ACCOUNT_URL.BASE}/${id}`, config);
  },
  async search(request: RequestInterfaces.ICommonSearchRequest) {
    const config = await getApiConfig();
    return ApiInstance.post(`${ACCOUNT_URL.SEARCH}`, request, config);
  },
  async searchByPhoneNumbers(
    request: RequestInterfaces.ISearchAccountByPhoneNumbers
  ) {
    const config = await getApiConfig();
    return ApiInstance.post(
      `${ACCOUNT_URL.SEARCH_BY_PHONE_NUMBERS}`,
      request,
      config
    );
  },
};

export default accountService;
