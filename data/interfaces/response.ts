import { Interfaces } from "./model";

export namespace ResponseInterfaces {
  export interface ICommonResponse<T> {
    code: number;
    data: T;
    message: string;
  }

  export interface ICommonSearchResponse<T> {
    totalRecords: number;
    recordSize: number;
    list: T[];
  }

  // auth
  export interface ILoginResponse {
    token: string;
    data: Interfaces.IUser;
  }

  export interface IFileResponse {
    id: string;
    url: string;
    type: "MP3" | "MP4" | "IMG" | "DOC";
    postId: string;
  }

  export interface IMessengerResponse {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy: Interfaces.IUser;
    name?: string;
    type?: "GROUP" | "PERSONAL" | "CHATBOT";
    members?: Interfaces.IUser[];
  }

  export interface IMessageResponse {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Interfaces.IUser;
    content?: string;
    messenger?: string;
  }

  export interface INotificationResponse {
    message?: string;
    message2?: string;
  }

  export interface IRoomResponse extends Interfaces.IEntity {
    hire?: IHireResponse;
    members?: Interfaces.IUser[];
    expectedCallDuration?: number;
    actualCallDuration?: number;
    status?: "IN_PROGRESS" | "FINISHED";
  }

  export interface IHireResponse extends Interfaces.IEntity {
    teacher?: Interfaces.IUser;
    cost?: number;
    totalTime?: number;
    status?: "ACCEPTED" | "REJECTED" | "PENDING" | "ENDED";
    room?: IRoomResponse;
  }

  export interface ICourseResponse extends Interfaces.IEntity {
    id?: string;
    name?: string;
    description?: string;
    cost?: number;
    language?: string;
    level?: number;
    members?: Interfaces.IAccount[];
    topics?: ITopicResponse[];
  }

  export interface ITopicResponse extends Interfaces.IEntity {
    id?: string;
    description?: string;
    tag?: ITagResponse;
  }

  export interface ITagResponse {
    id?: string;
    name?: string;
    language?: string;
  }

  export interface IChatbotResponse {
    message: string;
    courses?: ICourseResponse[];
    type?: "ASK" | "ANSWER";
  }

  export interface IOtpResponse {
    correct: boolean;
    remainSent: number;
    retryTime: number;
  }
}
