import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance } from "./axios";
import { AUTH_URL } from "./url";

const authService = {
  register(request: RequestInterfaces.IRegisterRequest) {
    return ApiInstance.post(AUTH_URL.REGISTER, request);
  },

  login(request: RequestInterfaces.ILoginRequest) {
    return ApiInstance.post(AUTH_URL.LOG_IN, request);
  },

  checkValidRegisterInfo(request: RequestInterfaces.IRegisterRequest) {
    return ApiInstance.post(AUTH_URL.CHECK_VALID_REGISTER_INFO, request);
  },
};

export default authService;
