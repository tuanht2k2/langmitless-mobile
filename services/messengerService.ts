import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { MESSENGER_URL } from "./url";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "@/firebaseConfig";
import { ref } from "firebase/database";

const messengerService = {
  async create(request: RequestInterfaces.IEditCommentRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(MESSENGER_URL.BASE, request, config);
  },
  async search(request: RequestInterfaces.ISearchCommentRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(MESSENGER_URL.SEARCH, request, config);
  },
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
};

export default messengerService;
