import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { TAG_URL } from "./url";

const tagService = {
  async search(request: RequestInterfaces.ISearchTagRequest) {
    try {
      return apiService.post(TAG_URL.SEARCH, request);
    } catch (error) {
      throw error;
    }
  },
  async create(request: RequestInterfaces.IEditTagRequest) {
    try {
      return apiService.post(TAG_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async edit(request: RequestInterfaces.IEditCourseRequest) {
    try {
      return apiService.put(TAG_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async get(id: string) {
    try {
      return apiService.get(`${TAG_URL.BASE}/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default tagService;
