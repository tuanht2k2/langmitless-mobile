import {RequestInterfaces} from "@/data/interfaces/request";
import { apiService } from "./axios";
import {COURSE_URL, QUESTION_URL_V2, TOPIC_URL} from "./url";

const questionService = {
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

  async getListQuestionByTopic(request:RequestInterfaces.ITopicsSearchRequest){
    try{
      return apiService.post(`${QUESTION_URL_V2.BASE}/by-topic`,request)
    }catch (error){
      throw error
    }
  },

  async createQuestionMultipleChoice(request:RequestInterfaces.IMultipleChoiceRequest){
    try{
      return apiService.post(`${QUESTION_URL_V2.BASE}/multiple-choice`,request)
    }catch (error){
      throw error;
    }
  },

  async createQuestionPronunciation(request:RequestInterfaces.IPronunciationRequest){
    try{
      const formData = new FormData();
      formData.append("topicId", request.topicId || "");
      formData.append("content", request.content);
      formData.append("audioSample", request.audioSample);

      return apiService.postForm(`${QUESTION_URL_V2.BASE}/pronunciation`,formData)
    }catch (error){
      throw error;
    }
  }
};

export default questionService;
