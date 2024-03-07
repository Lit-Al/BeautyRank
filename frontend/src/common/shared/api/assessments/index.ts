import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';

export const getMemberAssessmentsAttributes = (
  memberId: number
): AxiosPromise<any[]> =>
  axiosInstanse.get(
    ENDPOINTS.ASSESSMENTS.ATTRIBUTE + '?nomination__nom__categ__id=' + memberId
  );

interface IResult {
  member_nomination: number;
  event_staff: number;
  score: number;
  score_retails?: {
    [key: string]: number | string;
  };
}

export const setMemberResults = (data: IResult): AxiosPromise<IResult> =>
  axiosInstanse.post(ENDPOINTS.ASSESSMENTS.RESULTS, data);
