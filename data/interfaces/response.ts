import { Interfaces } from "./model";

export namespace ResponseInterfaces {
  export interface ICommonResponse<T> {
    code: number;
    data: T;
    message: string;
  }

  export interface ICommonSearchResponse<T> {
    recordSize: number;
    data: T[];
  }

  // auth
  export interface ILoginResponse {
    token: string;
    data: Interfaces.IUser;
  }
}
