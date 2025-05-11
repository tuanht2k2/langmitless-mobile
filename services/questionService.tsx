import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { COURSE_URL, QUESTION_URL_V2 } from "./url";

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

  async getListQuestionByTopic(
    request: RequestInterfaces.ITopicsSearchRequest
  ) {
    try {
      return apiService.post(`${QUESTION_URL_V2.BASE}/by-topic`, request);
    } catch (error) {
      throw error;
    }
  },

  async createQuestionMultipleChoice(
    request: RequestInterfaces.IMultipleChoiceRequest
  ) {
    try {
      return apiService.post(
        `${QUESTION_URL_V2.BASE}/multiple-choice`,
        request
      );
    } catch (error) {
      throw error;
    }
  },

  createQuestionPronunciation(
    request: RequestInterfaces.IPronunciationRequest
  ) {
    try {
      const formData = new FormData();
      formData.append("topicId", request.topicId);
      formData.append("content", request.content);
      formData.append("audioSample", {
        uri: request.audioSample.uri,
        name: request.audioSample.name,
        type: request.audioSample.type,
      } as any);

      return apiService.postForm(
        `${QUESTION_URL_V2.BASE}/pronunciation`,
        formData
      );
    } catch (error) {
      console.log(error);
    }
  },

  updateQuestionPronunciation(
    questionId: string,
    request: RequestInterfaces.IPronunciationRequestUpdate
  ) {
    try {
      const formData = new FormData();

      formData.append("questionId", questionId);
      formData.append("content", request.content);

      if (request.audioSample) {
        const file = {
          uri: request.audioSample.uri,
          name: request.audioSample.name,
          type: request.audioSample.type || "audio/mpeg",
        };
        formData.append("audioSample", file as any); // Thêm tệp âm thanh vào FormData
      }

      return apiService.postForm(
        `${QUESTION_URL_V2.BASE}/pronunciation/update`,
        formData
      );
    } catch (error) {
      console.log("Error in updateQuestionPronunciation:", error);
    }
  },

  async deleteQuestion(questionId: string | undefined) {
    try {
      return apiService.delete(`${QUESTION_URL_V2.BASE}/${questionId}`);
    } catch (error) {
      throw error;
    }
  },

  async updateQuestionMultipleChoice(
    questionId: string | undefined,
    request: RequestInterfaces.IMultipleChoiceRequestUpdate
  ) {
    try {
      return apiService.post(
        `${QUESTION_URL_V2.BASE}/multiple-choice/update/${questionId}`,
        request
      );
    } catch (error) {
      throw error;
    }
  },
};

export default questionService;
