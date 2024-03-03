import { IModel } from 'common/entities/model';
import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';
import { IPhoto } from 'pages/upload-photo/[modelId]';

export const getModels = (champId: number): AxiosPromise<IModel[]> =>
  axiosInstanse.get(
    ENDPOINTS.MODELS.MODELS +
      '?category_nomination__event_category__event=' +
      champId
  );

export const getModel = (modelId: number): AxiosPromise<IModel> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS + modelId + '/');

// export const getModelPhotos = (modelId: number): AxiosPromise<IModel> =>
//   axiosInstanse.get(ENDPOINTS.MODELS.MODELS + modelId + '/');

export const setModelPhotos = (data: any) =>
  axiosInstanse.post(ENDPOINTS.MODELS.PHOTOS, data);
