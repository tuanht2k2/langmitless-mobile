import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService, getApiConfig } from "./axios";
import { CRASH_URL } from "./url";
import axios from "axios";

const testConnectionService = async (url?: string) => {
  const apiInstance = axios.create({
    baseURL: url || "http://localhost:8080/api/v1/",
    timeout: 10000,
    headers: {
      "X-Custom-Header": "foobar",
    },
  });
  const request = {
    from: "2025-01-01",
    to: "2025-01-10",
  };
  const config = await getApiConfig();
  return apiInstance.post(CRASH_URL.BASE, request, config);
};

export default testConnectionService;
