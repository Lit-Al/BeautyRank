export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  image: null | string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ISmsRequest {
  phone_number: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}

