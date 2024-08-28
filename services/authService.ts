import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance } from "./axios";
import { AUTH_URL } from "./url";

const authService = {
  register(request: RequestInterfaces.IRegisterRequest) {
    return ApiInstance.post(`/auth/${AUTH_URL.REGISTER}`, request);
  },

  login(request: RequestInterfaces.ILoginRequest) {
    return ApiInstance.post(`/auth/${AUTH_URL.LOG_IN}`, request);
  },
};

export default authService;
