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
    displayName?: string;
    createdAt?: Date;
    coverImage?: string;
  }

  export interface IAdmin extends IAccount {}

  export interface IUser extends IAccount {
    identificationNumber?: string;
    dob?: Date;
    address?: string;
    gender?: number;
    fullName?: string;
    relationship?: ResponseInterfaces.IRelationshipResponse;
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
}
