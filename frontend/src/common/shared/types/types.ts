export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  image: null | File | string;
  optimized_image?: string | null;
  phone_number: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
  success?: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}
