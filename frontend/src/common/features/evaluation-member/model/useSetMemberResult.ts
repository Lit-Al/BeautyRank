import { useMutation } from 'react-query';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { IResult, SetMemberResultProps } from '../lib';
import { setMemberResults } from 'common/shared/api/assessments';
import router from 'next/router';

export const useSetMemberResult = ({
  memberId,
  totalScore,
  memberAttributes,
}: SetMemberResultProps) => {
  const user = useAtomValue(userAtom);

  return useMutation(['memberResult'], async () => {
    try {
      if (user && memberId) {
        const result: IResult = {
          member_nomination: memberId,
          event_staff: user.id!,
          score: totalScore,
          score_retail: {},
        };

        memberAttributes.forEach((attribute) => {
          if (attribute.score !== undefined) {
            result.score_retail![attribute.name] = attribute.score.toString();
          }
        });

        setMemberResults(result);
        router.push('/profile');
      }
    } catch (e) {
      console.log(e);
    }
  });
};
