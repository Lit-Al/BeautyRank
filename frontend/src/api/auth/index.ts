import { axiosInstanse } from '../instanse';
import { ILoginRequest, ILoginResponse } from './types';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';

export const login = (params: ILoginRequest): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.LOGIN, params);

export const refreshToken = (refreshToken: any): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.REFRESH, refreshToken);
