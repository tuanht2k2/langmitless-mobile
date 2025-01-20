import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { FILE_URL } from "./url";

const fileService = {
  async search() {
    try {
      return apiService.post(FILE_URL.SEARCH, {});
    } catch (error) {
      throw error;
    }
  },
  async upload(request: any) {
    try {
      return apiService.post(FILE_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async edit(request: any) {
    try {
      return apiService.put(FILE_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async get(id: string) {
    try {
      return apiService.get(`${FILE_URL.BASE}/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default fileService;
