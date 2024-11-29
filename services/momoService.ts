import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { MOMO_URL } from "./url";

const momoService = {
  create: async (request: RequestInterfaces.IEditPaymentRequest) => {
    return apiService.post(MOMO_URL.BASE, request);
  },
};

export default momoService;
