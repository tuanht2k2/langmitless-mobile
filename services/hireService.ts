import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { HIRE_URL } from "./url";

const hireService = {
  async create(
    request: RequestInterfaces.IEditHireRequest,
    handleError: (error?: any) => void
  ) {
    try {
      return apiService.post(HIRE_URL.BASE, request, handleError);
    } catch (error) {
      handleError();
    }
  },

  async updateStatus(
    request: RequestInterfaces.IEditHireRequest,
    handleError?: (error?: any) => void
  ) {
    try {
      return apiService.put(HIRE_URL.BASE, request, handleError);
    } catch (error) {
      handleError?.();
    }
  },
};

export default hireService;
