export const BASE_URL = 'http://127.0.0.1:8000';

export const BEAUTY_RANK_BOT = 'https://t.me/BeautyRankBot?start=';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/token/`,
    REFRESH: `${BASE_URL}/api/v1/token/refresh/`,
    SMS_CALL: `${BASE_URL}/api/v1/users/login_in/`,
  },
  USERS: {
    ME: `${BASE_URL}/api/v1/users/me/`,
  },
  MEMBERS: {
    MEMBERS: `${BASE_URL}/api/v1/memberNomination/`,
    PHOTOS: `${BASE_URL}/api/v1/memberNominationPhoto/`,
  },
  EVENTS: {
    CHAMP: `${BASE_URL}/api/v1/event/`,
  },
  ASSESSMENTS: {
    ATTRIBUTE: `${BASE_URL}/api/v1/nominationAttribute/`,
    RESULTS: `${BASE_URL}/api/v1/result/`,
  },
};
