import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { TOPIC_URL } from "./url";

const topicService = {
  async search(request: RequestInterfaces.ISearchCourseRequest) {
    try {
      return apiService.post(TOPIC_URL.SEARCH, request);
    } catch (error) {
      throw error;
    }
  },
  async create(request: RequestInterfaces.IEditCourseRequest) {
    try {
      return apiService.post(TOPIC_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async edit(request: RequestInterfaces.IEditCourseRequest) {
    try {
      return apiService.put(TOPIC_URL.BASE, request);
    } catch (error) {
      throw error;
    }
  },
  async get(id: string) {
    try {
      return apiService.get(`${TOPIC_URL.BASE}/${id}`);
    } catch (error) {
      throw error;
    }
  },
  async searchTransactions(
    request: RequestInterfaces.ISearchTransactionRequest
  ) {
    try {
      return apiService.post(TOPIC_URL.SEARCH_TRANSACTIONS, request);
    } catch (error) {
      throw error;
    }
  },
  async getScoreByTransaction(
    request: RequestInterfaces.IGetScoreByTransactionRequest
  ) {
    try {
      return apiService.post(TOPIC_URL.GET_SCORE_BY_TRANSACTIONS, request);
    } catch (error) {
      throw error;
    }
  },
};

export default topicService;
