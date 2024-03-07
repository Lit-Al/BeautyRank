import { axiosInstanse } from '../instanse';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';
import { IChamp } from 'common/entities/champ';

export const getChamps = (): AxiosPromise<IChamp[]> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP);

export const getChamp = (idChamp: number): AxiosPromise<IChamp> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP + idChamp);
