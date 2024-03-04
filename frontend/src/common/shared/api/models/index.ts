import { IModel } from 'common/entities/model';
import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';
import { IPhoto } from 'common/features/upload-model-photo/model';

export const getModels = (champId: number): AxiosPromise<IModel[]> =>
  axiosInstanse.get(
    ENDPOINTS.MODELS.MODELS +
      '?category_nomination__event_category__event=' +
      champId
  );

export const getModel = (modelId: number): AxiosPromise<IModel> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS + modelId + '/');

export const getModelPhotos = (modelId: number): AxiosPromise<IPhoto[]> =>
  axiosInstanse.get(ENDPOINTS.MODELS.PHOTOS + '?member_nomination=' + modelId);

export const setModelPhotos = (data: FormData) =>
  axiosInstanse.post(ENDPOINTS.MODELS.PHOTOS, data);
