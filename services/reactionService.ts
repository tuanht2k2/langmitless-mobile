import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { REACTION_URL } from "./url";

const reactionService = {
  async create(request: RequestInterfaces.IEditReactionRequest) {
    let config = await getApiConfig();
    return ApiInstance.post(REACTION_URL.BASE, request, config);
  },
  async update(request: RequestInterfaces.IEditReactionRequest) {
    let config = await getApiConfig();
    return ApiInstance.put(REACTION_URL.BASE, request, config);
  },
  async delete(id: string) {
    let config = await getApiConfig();
    return ApiInstance.delete(`${REACTION_URL.BASE}/${id}`, config);
  },
};

export default reactionService;
