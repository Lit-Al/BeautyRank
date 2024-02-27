import { axiosInstanse } from '../instanse';
import { IChamp } from 'common/shared/types';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';

export const getChamps = (): AxiosPromise<IChamp[]> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP);

export const getChamp = (idChamp: number): AxiosPromise<IChamp> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP + idChamp);
