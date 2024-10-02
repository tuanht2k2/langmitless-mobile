import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { COMMENT_URL } from "./url";
import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "@/firebaseConfig";
import { ref } from "firebase/database";

const commentService = {
  getCommentsRef(postId: string) {
    return ref(database, `posts/${postId}/comments`);
  },
  async create(request: RequestInterfaces.IEditCommentRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(COMMENT_URL.BASE, request, config);
  },
  async search(request: RequestInterfaces.ISearchCommentRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(COMMENT_URL.SEARCH, request, config);
  },
  async get(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${COMMENT_URL.BASE}/${id}`, config);
  },
};

export default commentService;
