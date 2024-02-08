import axios, { AxiosError, AxiosPromise } from 'axios';
import { ENDPOINTS } from './endpoints';
import { ILoginResponse } from './auth/types';
import api from '.';

export const axiosInstanse = axios.create({});

// эндпоинты где не нужен access токен
const urlsSkipAuth = [
  ENDPOINTS.AUTH.REFRESH,
  ENDPOINTS.AUTH.LOGIN,
  ENDPOINTS.AUTH.SMS_CALL,
];

axiosInstanse.interceptors.request.use(async (config: any) => {
  if (config.url && urlsSkipAuth.includes(config.url)) {
    return config;
  }

  const accessTokenStorage = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken')?.replace(/"/g, '');
  const isLoggedIn = localStorage.getItem('user');

  axiosInstanse.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && isLoggedIn) {
        localStorage.removeItem('user');
      }
    }
  );

  interface IAuthTokenInfo {
    exp: number;
    iat: number;
    login: string;
  }
  const isTokenExpired = (token: string | null) => {
    if (!token) {
      return true;
    }

    try {
      const tokenInfo = token.split('.')[1];
      const tokenInfoDecoded = window.atob(tokenInfo);
      const { exp, iat }: IAuthTokenInfo = JSON.parse(tokenInfoDecoded);
      const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5;

      const tokenLeftTime = exp - Math.round(+new Date() / 1000);

      const timeForUpdate = (exp - iat) * LIFE_TIME_TO_UPDATE_MULTIPLIER;

      return tokenLeftTime < timeForUpdate;
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  let refreshTokenRequest: AxiosPromise<ILoginResponse> | null = null;
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const accessToken = accessTokenStorage?.replace(/"/g, '');

      if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshTokenRequest === null) {
          refreshTokenRequest = api.auth.refreshToken({
            refresh: refreshToken,
          });
        }

        const res = await refreshTokenRequest;
        console.log(res);
        
        refreshTokenRequest = null;

        localStorage.setItem('accessToken', res.data.access);

        return res.data.access;
      }

      return accessToken;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const accessToken = await getAccessToken();

  if (accessToken) {
    const authorization = `Bearer ${accessToken}`;

    config.headers = {
      ...config.headers,
      Authorization: authorization,
    };
  }
  return config;
});

axiosInstanse.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoggedIn = localStorage.getItem('accessToken');

    if (error.response?.status === 401 && isLoggedIn) {
      localStorage.clear();
      
    }
  }
);
