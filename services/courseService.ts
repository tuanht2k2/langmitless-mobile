import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { COURSE_URL } from "./url";

const courseService = {
  async search(request: RequestInterfaces.ISearchCourseRequest) {
    try {
      return apiService.post(COURSE_URL.SEARCH, request);
    } catch (error) {
      throw error;
    }
  },
  async create(request: RequestInterfaces.IEditCourseRequest) {
    try {
      return apiService.post(COURSE_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async edit(request: RequestInterfaces.IEditCourseRequest) {
    try {
      return apiService.put(COURSE_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async get(id: string) {
    try {
      return apiService.get(`${COURSE_URL.BASE}/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default courseService;
