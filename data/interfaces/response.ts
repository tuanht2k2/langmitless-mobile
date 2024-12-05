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
    type?: "GROUP" | "PERSONAL";
    members?: Interfaces.IUser[];
  }

  export interface IMessageResponse {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Interfaces.IUser;
    content?: string;
    messengerId?: string;
  }

  export interface INotificationResponse {
    message?: string;
  }

  export interface IHireResponse {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Interfaces.IUser;
    teacher?: Interfaces.IUser;
    cost?: number;
    totalTime?: number;
    status?: "ACCEPTED" | "REJECTED";
  }
}
