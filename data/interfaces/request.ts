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

  export interface ICommonDeleteRequest {
    ids: string[];
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
    phoneNumber?: string;
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
}
