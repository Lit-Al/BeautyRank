import { IResult } from 'common/features/evaluation-member/lib';
import { ENDPOINTS } from '../endpoints';
import { axiosInstanse } from '../instanse';
import { AxiosPromise } from 'axios';

export const getMemberAssessmentsAttributes = (
  memberId: number
): AxiosPromise<[]> =>
  axiosInstanse.get(
    ENDPOINTS.ASSESSMENTS.ATTRIBUTE + '?nomination__nom__categ__id=' + memberId
  );

export const setMemberResults = (data: IResult): AxiosPromise<IResult> =>
  axiosInstanse.post(ENDPOINTS.ASSESSMENTS.RESULTS, data);

export const getMemberResults = (memberId: number): AxiosPromise<IResult[]> =>
  axiosInstanse.get(
    ENDPOINTS.ASSESSMENTS.RESULTS + '?member_nomination=' + memberId
  );
