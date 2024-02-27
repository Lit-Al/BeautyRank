import { IModel } from 'common/shared/types';
import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';

export const getModels = (): AxiosPromise<IModel[]> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS);

export const getModel = (modelId: number): AxiosPromise<IModel> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS + modelId);
