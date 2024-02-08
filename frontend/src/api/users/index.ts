import { axiosInstanse } from '../instanse';
import { IUser } from './types';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';

export const getMe = (): AxiosPromise<IUser> =>
  axiosInstanse.get(ENDPOINTS.USERS.ME);
  
export const setAvatar = (avatar: FormData): AxiosPromise<IUser> =>
  axiosInstanse.patch(ENDPOINTS.USERS.ME, avatar,);
