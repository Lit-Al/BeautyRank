export const BASE_URL = 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/token/`,
    REFRESH: `${BASE_URL}/api/token/refresh/`,
    SMS_CALL: `${BASE_URL}/api/v1/users/login_in/`,
  },
  USERS: {
    ME: `${BASE_URL}/api/v1/users/me/`,
  },
  MODELS: {
    MODELS: `${BASE_URL}/api/v1/memberNomination/`,
  }
};
