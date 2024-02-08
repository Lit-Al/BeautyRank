export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  image: null | string;
}

export interface IAvatar {
  image: null | string;
}
