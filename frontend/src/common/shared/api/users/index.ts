import { axiosInstanse } from '../instanse';
import { IUser } from 'common/shared/types';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';

export const getMe = (): AxiosPromise<IUser> =>
  axiosInstanse.get(ENDPOINTS.USERS.ME);
  
export const setUser = (userData: IUser): AxiosPromise<IUser> =>
  axiosInstanse.patch(ENDPOINTS.USERS.ME, userData,);
