export namespace RequestInterfaces {
  export interface ICommonSearchRequest {
    page: number;
    pageSize: number;
    keyword: string;
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
}
