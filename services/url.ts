export enum AUTH_URL {
  LOG_IN = "/auth/log-in",
  REGISTER = "/auth/register",
  LOG_OUT = "/auth/log-out",
  CHECK_VALID_REGISTER_INFO = "/auth/check-valid-register-info",
}

export enum ACCOUNT_URL {
  BASE = "accounts",
  SEARCH = "/accounts/search",
  SEARCH_BY_PHONE_NUMBERS = "/accounts/search-by-phone-numbers",
  FIND_BY_PHONE = "/accounts/find-by-phone",
  BECOME_A_TEACHER = "/accounts/become-a-teacher",
  UPDATE_STATUS = "/accounts/update-status",
  SEARCH_HIRE_HISTORY = "/accounts/search-hire-history",
}

export enum POST_URL {
  BASE = "/posts",
  SEARCH = "/posts/search",
}

export enum COMMENT_URL {
  BASE = "/comments",
  SEARCH = "/comments/search",
}

export enum REACTION_URL {
  BASE = "/reactions",
}

export enum MESSENGER_URL {
  BASE = "/messengers",
  FIND_BY_MEMBERS = "/messengers/find-by-members",
  FIND_PERSONAL_BY_MEMBERS = "/messengers/find-personal-by-members",
  SEARCH = "/messengers/search",
  SEARCH_BY_ACCOUNT = "/messengers/search-by-account",
}

export enum MESSAGE_URL {
  BASE = "/messages",
  SEARCH = "/messages/search",
}

export enum RELATIONSHIP_URL {
  BASE = "/relationships",
  ACCEPT_REQUEST = "/relationships/accept",
  DELETE = "/relationships/delete-by-ids",
  GET_FRIEND_REQUESTS = "/relationships/get-friend-requests",
}

export enum COMMENT_REPORT_URL {
  BASE = "/comment-reports",
  SEARCH = "/comment-reports/search",
}

export enum FPT_AI_URL {
  IDENTIFY = "/vision/idr/vnm/",
  FACE_MATCH = "/dmp/checkface/v1",
}

export enum MOMO_URL {
  BASE = "/payment/momo",
}

export enum HIRE_URL {
  BASE = "/hires",
}

export enum ROOM_URL {
  BASE = "/rooms",
  VIDEO_CALL = "/app/rooms/video-call",
}

export enum TAG_URL {
  BASE = "/tags",
  SEARCH = "/tags/search",
}

export enum COURSE_URL {
  BASE = "/courses",
  SEARCH = "/courses/search",
}

export enum TOPIC_URL {
  BASE = "/topics",
  SEARCH = "/topics/search",
}

export enum QUESTION_URL_V2 {
  BASE = "/question",
}

export enum QUESTION_URL {
  BASE = "/questions",
  SEARCH = "/questions/search",
}

export enum CHATBOT_URL {
  BASE = "/business/chatbot",
  GET_RESPONSE = "/chatbot/get-response",
  ASK = "/business/chatbot/ask",
}

export enum OTP_URL {
  GET = "/otp/get",
  VERIFY = "/otp/verify",
}

export enum PAYMENT_URL {
  CREATE = "/transfer/create",
}
