import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { MESSENGER_URL } from "./url";

const messengerService = {
  async create(request: RequestInterfaces.IEditMessengerRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(MESSENGER_URL.BASE, request, config);
  },
  // async search(request: RequestInterfaces.ISearchCommentRequest) {
  //   const config = await getApiConfig();

  //   return ApiInstance.post(MESSENGER_URL.SEARCH, request, config);
  // },
  async get(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${MESSENGER_URL.BASE}/${id}`, config);
  },
  async findPersonalByMembers(id: string) {
    const config = await getApiConfig();
    return ApiInstance.post(
      `${MESSENGER_URL.FIND_PERSONAL_BY_MEMBERS}`,
      { targetMember: id },
      config
    );
  },
  async findMessengersByAccount(
    request: RequestInterfaces.ISearchMessengerByAccountRequest
  ) {
    const config = await getApiConfig();
    return ApiInstance.post(
      `${MESSENGER_URL.SEARCH_BY_ACCOUNT}`,
      request,
      config
    );
  },
};

export default messengerService;
