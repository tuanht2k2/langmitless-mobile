import { Interfaces } from "./model";

export namespace RequestInterfaces {
  export interface IIndentifyRequest {
    image: Interfaces.IMultipartFile;
  }

  export interface IFaceMatchRequest {
    file: Interfaces.IMultipartFile[];
  }

  export interface ICommonSearchRequest {
    page: number;
    pageSize: number;
    keyword: string;
    sortBy: string;
    sortDir: "ASC" | "DESC";
  }

  export interface ISearchAccountRequest extends ICommonSearchRequest {
    role: "ADMIN" | "USER" | "TEACHER";
  }

  export interface ICommonDeleteRequest {
    ids: string[];
  }

  export interface ILoginRequest {
    phoneNumber: string;
    password: string;
  }

  export interface IRegisterRequest {
    email?: string;
    password?: string;
    name?: string;
    phoneNumber?: string;
  }

  export interface IEditAccountRequest extends IRegisterRequest {
    id?: string;
    identification?: string;
    address?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    fullName?: string;
  }

  // chat
  export interface IEditMessengerRequest {
    id?: string;
    name?: string;
    members?: string[];
    type: "GROUP" | "PERSONAL";
  }

  export interface IEditMessageRequest {
    messengerId: string;
    content: string;
  }

  export interface ISearchMessageRequest {
    messengerId?: string;
  }

  export interface ISearchMessengerByAccountRequest {
    accountId?: string;
  }

  export interface ISearchAccountByPhoneNumbers {
    phoneNumbers: string[];
  }

  export interface IEditPaymentRequest {
    amount?: number;
    description?: string;
    receiver?: string;
  }

  export interface IEditAccountStatusRequest {
    id?: string;
    status: "ONLINE" | "OFFLINE" | "IN_CALL" | "BLOCKED";
  }

  export interface IEditHireRequest {
    id?: string;
    teacherId?: string;
    totalTime?: number;
    status?: "ACCEPTED" | "REJECTED" | "ENDED";
  }

  export interface ISearchCourseRequest extends ICommonSearchRequest {
    createdBy?: string;
  }

  export interface IEditCourseRequest {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    cost?: number;
    level?: number;
  }

  export interface IEditTopicRequest {
    id?: string;
    description?: string;
    tagId?: string;
    courseId?: string;
  }

  export interface IEditTagRequest {
    id?: string;
    name?: string;
    language?: string;
  }

  export interface ISearchTagRequest {
    name?: string;
    language?: string;
  }

  export interface IChatBotRequest {
    content: string;
    type?: "COURSE" | "TEACHER" | "QA";
  }
}
