import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, apiService, getApiConfig } from "./axios";
import { MESSAGE_URL } from "./url";

const messageService = {
  async create(request: RequestInterfaces.IEditMessageRequest) {
    const formData = new FormData();
    formData.append("messengerId", request.messengerId);

    if (request.content) {
      formData.append("content", request.content);
    }

    if (request.files && Array.isArray(request.files)) {
      request.files.forEach((file: File | Blob, index: number) => {
        formData.append("files", file);
      });
    }

    return apiService.postForm(MESSAGE_URL.CREATE, formData);
  },

  async search(id: string) {
    return apiService.post(MESSAGE_URL.SEARCH, { id });
  },
  async get(id: string) {
    const config = await getApiConfig();
    return ApiInstance.get(`${MESSAGE_URL.BASE}/${id}`, config);
  },
};

export default messageService;
