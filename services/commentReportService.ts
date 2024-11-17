import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { COMMENT_REPORT_URL } from "./url";

const commentReportService = {
  async create(request: RequestInterfaces.IEditCommentReportRequest) {
    const config = await getApiConfig();

    return ApiInstance.post(COMMENT_REPORT_URL.BASE, request, config);
  },
};

export default commentReportService;
