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
  }

  export interface IAdmin extends IAccount {}

  export interface IUser extends IAccount {
    identificationNumber?: string;
    dob?: Date;
    address?: string;
    gender?: number;
    fullName?: string;
  }

  export interface IMultipartFile {
    uri: string;
    name: string;
    type: string;
  }

  export interface IComment {
    id: string;
    createdAt: Date;
    content: string;
    createdBy: IUser;
    updatedBy: IUser;
  }
}
