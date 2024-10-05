import { EReactionType } from "@/components/Post";
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

  // post
  export interface IPostResponse {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    content?: string;
    type?: "NORMAL" | "PROFILE_IMAGE";
    audience?: "PUBLIC" | "FRIENDS" | "PRIVATE";
    createdBy?: Interfaces.IUser;
    reactions?: IReactionResponse[];
    group?: any;
    files: IFileResponse[];
  }

  export interface IReactionResponse {
    id?: string;
    createdBy?: Interfaces.IUser;
    createdAt?: Date;
    type: EReactionType;
  }

  export interface ICommentResponse {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    content?: string;
    type?: "NORMAL" | "PROFILE_IMAGE";
    audience?: "PUBLIC" | "FRIENDS" | "PRIVATE";
    createdBy?: Interfaces.IUser;
    group?: any;
    files: IFileResponse[];
  }
}
