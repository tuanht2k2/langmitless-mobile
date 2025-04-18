import { ResponseInterfaces } from "./response";

export namespace Interfaces {
  // account
  export interface IAccount {
    id?: string;
    type?: number;
    phoneNumber?: string;
    email?: string;
    password?: string;
    profileImage?: string;
    name?: string;
    fullName?: string;
    role?: "ADMIN" | "USER" | "TEACHER";
    createdAt?: Date;
    status?: "ONLINE" | "OFFLINE" | "BLOCKED";
  }

  export interface IAdmin extends IAccount {}

  export interface IUser extends IAccount {
    balance?: number;
    cost?: number;
    hireHistory?: ResponseInterfaces.IHireResponse[];
  }

  export interface IMultipartFile {
    uri: string;
    name: string;
    type: string | Blob;
  }

  export interface IComment {
    id: string;
    createdAt: Date;
    content: string;
    createdBy: IUser;
    updatedBy: IUser;
  }

  export interface IWebRTC {
    roomId?: string;
    createdBy?: string;
    type?: "offer" | "answer" | "candidate";
    sdp?: string;
    candidate?: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
  }

  export interface IEntity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Interfaces.IUser;
    updatedBy?: Interfaces.IUser;
  }
}
