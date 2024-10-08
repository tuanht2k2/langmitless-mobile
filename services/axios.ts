import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const ApiInstance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_BASE_URL?.replace(/['";]/g, "") ||
    "http://localhost:8080/api/v1/",
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
  },
});

export const FptAiApiInstance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_FPT_AI_BASE_URL?.replace(/['";]/g, "") ||
    "http://localhost:8080/api/v1/",
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
    api_key: process.env.EXPO_PUBLIC_FPT_AI_API_KEY,
  },
});

export const getApiConfig = async () => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return config;
};
