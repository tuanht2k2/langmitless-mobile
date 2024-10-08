import { RequestInterfaces } from "@/data/interfaces/request";
import { FptAiApiInstance } from "./axios";
import { FPT_AI_URL } from "./url";

const fptAiService = {
  identify(request: any) {
    const formData = new FormData();
    formData.append("image", request);

    return FptAiApiInstance.postForm(FPT_AI_URL.IDENTIFY, formData);
  },
  faceMatch(request: RequestInterfaces.IFaceMatchRequest) {
    return FptAiApiInstance.postForm(FPT_AI_URL.FACE_MATCH, request);
  },
};

export default fptAiService;
