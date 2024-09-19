export namespace RequestInterfaces {
  export interface ICommonSearchRequest {
    page: number;
    pageSize: number;
    keyword: string;
    sortBy: string;
    sortDir: "ASC" | "DESC";
  }

  export interface ILoginRequest {
    phoneNumber: string;
    password: string;
  }

  export interface IRegisterRequest {
    username?: string;
    email?: string;
    password?: string;
    displayName?: string;
    identificationNumber?: string;
    dob?: Date;
    address?: string;
    gender?: number;
    fullName?: string;
  }

  export interface IEditPostRequest {
    content?: string;
    type?: string;
    audience?: string;
    files?: any;
  }

  export interface IEditCommentRequest {
    postId: string;
    content?: string;
    files?: any;
  }

  export interface ISearchPostRequest extends ICommonSearchRequest {
    createdBy?: string;
    group?: string;
    audience?: "PUBLIC" | "PRIVATE" | "FRIENDS";
  }

  export interface ISearchCommentRequest extends ICommonSearchRequest {
    postId?: string;
    createdBy?: string;
  }
}
