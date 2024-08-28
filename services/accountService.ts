import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { ACCOUNT_URL } from "./url";

const accountService = {
  async getAccount(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${ACCOUNT_URL.BASE}/${id}`, config);
  },
  search(request: RequestInterfaces.ICommonSearchRequest) {
    return ApiInstance.post(ACCOUNT_URL.BASE, request);
  },
};

export default accountService;
