import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { CRASH_URL } from "./url";

const crashService = {
  create(request: RequestInterfaces.IEditCrashRequest) {
    try {
      return apiService.post(CRASH_URL.BASE, request);
    } catch (error) {}
  },
  test() {
    try {
      return apiService.get(CRASH_URL.BASE);
    } catch (error) {}
  },
};

export default crashService;
