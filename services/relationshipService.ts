import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { RELATIONSHIP_URL } from "./url";

const relationshipService = {
  async create(request: RequestInterfaces.IEditRelationshipRequest) {
    const config = await getApiConfig();
    return ApiInstance.post(RELATIONSHIP_URL.BASE, request, config);
  },
  async acceptRequest(request: RequestInterfaces.IEditRelationshipRequest) {
    const config = await getApiConfig();
    return ApiInstance.post(RELATIONSHIP_URL.ACCEPT_REQUEST, request, config);
  },
  async delete(request: RequestInterfaces.ICommonDeleteRequest) {
    const config = await getApiConfig();
    return ApiInstance.post(RELATIONSHIP_URL.DELETE, request, config);
  },
  async getFriendRequests() {
    const config = await getApiConfig();
    return ApiInstance.get(RELATIONSHIP_URL.GET_FRIEND_REQUESTS, config);
  },
};

export default relationshipService;
