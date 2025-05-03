import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, apiService, getApiConfig } from "./axios";
import { MESSENGER_URL } from "./url";

const messengerService = {
  async details(id: string) {
    return apiService.post(MESSENGER_URL.DETAILS, { id });
  },
  async findMessengersByAccount() {
    return apiService.post(`${MESSENGER_URL.SEARCH_BY_ACCOUNT}`, null);
  },
  async findMessengerWithAnother(anotherAccountId: string) {
    return apiService.post(`${MESSENGER_URL.FIND_PERSONAL_WITH_ANOTHER}`, {
      id: anotherAccountId,
    });
  },
};

export default messengerService;
