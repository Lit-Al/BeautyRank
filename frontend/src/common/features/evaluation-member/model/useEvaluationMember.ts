import { getMemberAssessmentsAttributes } from 'common/shared/api/assessments';
import { getMemberPhotos, getMember } from 'common/shared/api/members';
import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useQuery } from 'react-query';
import { IMemberAssessmentsAttributes } from '../lib';

export const useMember = (memberId: number) => {
  const [memberAttributes, setMemberAttributes] = useState<
    IMemberAssessmentsAttributes[]
  >([]);
  const [totalScore, setTotalScore] = useState(0);

  const { data: memberPhotosData, isLoading: isPhotosLoading } = useQuery(
    'memberPhotos',
    () => getMemberPhotos(memberId),
    {
      enabled: !!memberId,
    }
  );

  const { data: memberData, isLoading: isMemberLoading } = useQuery(
    ['member', memberId],
    () => getMember(memberId),
    {
      enabled: !!memberId,
    }
  );

  const {
    data: memberAssessmentsAttributesData,
    isLoading: isAttributesLoading,
  } = useQuery(
    'memberAssessmentsAttributes',
    () => getMemberAssessmentsAttributes(memberId),
    {
      enabled: !!memberId,
    }
  );

  useEffect(() => {
    if (memberAssessmentsAttributesData) {
      setMemberAttributes(memberAssessmentsAttributesData.data);
    }
  }, [memberAssessmentsAttributesData]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      attribute: IMemberAssessmentsAttributes
    ) => {
      const newScore = Number(e.target.value);
      const oldScore = attribute.score || 0;
      setTotalScore(totalScore + newScore - oldScore);
      setMemberAttributes((prevMemberAttributes) =>
        prevMemberAttributes.map((attr) =>
          attr.name === attribute.name ? { ...attr, score: newScore } : attr
        )
      );
    },
    [totalScore]
  );

  return {
    member: memberData?.data,
    memberPhotos: memberPhotosData?.data,
    memberAttributes: memberAttributes,
    totalScore,
    isLoading: isPhotosLoading || isMemberLoading || isAttributesLoading,
    handleChange,
  };
};
