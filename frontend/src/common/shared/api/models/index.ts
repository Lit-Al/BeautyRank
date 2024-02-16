import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';

export const getModels = (): AxiosPromise<any> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS);
