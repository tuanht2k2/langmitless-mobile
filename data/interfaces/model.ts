export namespace Interfaces {
  // account
  export interface IAccount {
    id?: string;
    type?: number;
    username?: string;
    email?: string;
    fullName?: string;
    password?: string;
    profileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface IAdmin extends IAccount {}

  export interface IUser extends IAccount {
    identificationNumber?: string;
    dob?: Date;
    address?: string;
    gender?: number;
  }
}
