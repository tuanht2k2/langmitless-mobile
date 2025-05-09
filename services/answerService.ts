import { RequestInterfaces } from "@/data/interfaces/request";
import { apiService } from "./axios";
import { ANSWER_URL } from "@/services/url";

const answerService = {
  answerQuestionPronunciation(
    request: RequestInterfaces.IAnswerQuestionPronunciation
  ) {
    try {
      const formData = new FormData();
      formData.append("topicId", request.topicId);
      formData.append("questionId", request.questionId);
      formData.append("answerFile", {
        uri: request.answerFile.uri,
        name: request.answerFile.name,
        type: request.answerFile.type,
      } as any);
      return apiService.postForm(`${ANSWER_URL.BASE}/Pronunciation`, formData);
    } catch (error) {
      console.log(error);
    }
  },

  answerQuestionMultipleChoice(
    request: RequestInterfaces.IAnswerQuestionMultipleChoice
  ) {
    try {
      return apiService.post(`${ANSWER_URL.BASE}/MultipleChoice`, request);
    } catch (error) {
      console.log(error);
    }
  },

  getScoreByQuestion(request: RequestInterfaces.IQuestionScore) {
    try {
      return apiService.post(
        `${ANSWER_URL.BASE}/get-score-by-question`,
        request
      );
    } catch (error) {
      console.log(error);
    }
  },
};
export default answerService;
