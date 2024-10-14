export enum AUTH_URL {
  LOG_IN = "/auth/log-in",
  REGISTER = "/auth/register",
  LOG_OUT = "/auth/log-out",
  CHECK_VALID_REGISTER_INFO = "/auth/check-valid-register-info",
}

export enum ACCOUNT_URL {
  BASE = "accounts",
  SEARCH = "/accounts/search",
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
}

export enum FPT_AI_URL {
  IDENTIFY = "/vision/idr/vnm/",
  FACE_MATCH = "/dmp/checkface/v1",
}
