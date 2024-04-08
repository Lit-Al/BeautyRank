import { ILoginRequest, ILoginResponse } from 'common/shared/types';
import { axiosInstanse } from '../instanse';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';

export const login = (params: ILoginRequest): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.LOGIN, params);

export const smsCall = (phone: string): AxiosPromise<ILoginRequest> =>
  axiosInstanse.post(ENDPOINTS.AUTH.SMS_CALL, {
    phone_number: phone,
  });

interface IRefreshTokeRequest {
  refresh: string;
}

export const refreshToken = (
  refreshToken: IRefreshTokeRequest
): AxiosPromise<ILoginResponse> =>
  axiosInstanse.post(ENDPOINTS.AUTH.REFRESH, refreshToken);
