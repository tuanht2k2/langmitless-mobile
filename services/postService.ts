import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { POST_URL } from "./url";

const postService = {
  async create(request: any) {
    let config = await getApiConfig();

    const formData = new FormData();
    formData.append("audience", request.audience);
    formData.append("content", request.content);
    formData.append("type", request.type);

    request.files?.forEach((file: any) => {
      formData.append("files", file);
    });

    return ApiInstance.postForm(POST_URL.BASE, formData, config);
  },
  async search(request: RequestInterfaces.ISearchPostRequest) {
    let config = await getApiConfig();

    return ApiInstance.post(POST_URL.SEARCH, request, config);
  },
  async get(id: string) {
    let config = await getApiConfig();
    return ApiInstance.get(`${POST_URL.BASE}/${id}`, config);
  },
};

export default postService;
