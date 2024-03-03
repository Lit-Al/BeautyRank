import { axiosInstanse } from '../instanse';
import { ENDPOINTS } from '../endpoints';
import { AxiosPromise } from 'axios';
import { TChamp } from 'common/entities/champ';

export const getChamps = (): AxiosPromise<TChamp[]> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP);

export const getChamp = (idChamp: number): AxiosPromise<TChamp> =>
  axiosInstanse.get(ENDPOINTS.EVENTS.CHAMP + idChamp);
