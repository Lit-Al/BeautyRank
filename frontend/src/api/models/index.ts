import { ENDPOINTS } from "api/endpoints";
import { axiosInstanse } from "api/instanse";
import { AxiosPromise } from "axios";

export const getModels = (): AxiosPromise<any> =>
  axiosInstanse.get(ENDPOINTS.MODELS.MODELS);
