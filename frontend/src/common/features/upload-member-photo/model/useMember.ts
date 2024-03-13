import { useQuery } from 'react-query';
import { useState } from 'react';
import { getMember } from 'common/shared/api/members';
import { IPhoto } from '../lib/types';

export const useMember = (memberId: number) => {
  const [selectedFiles, setSelectedFiles] = useState<IPhoto[]>([]);

  const {
    data: member,
    isLoading,
    isError,
  } = useQuery(
    ['member', memberId],
    async () => {
      if (memberId) {
        const { data } = await getMember(memberId);
        setSelectedFiles(
          Array(
            data.nomination_info.after.length +
              data.nomination_info.before.length
          ).fill(null)
        );
        return data;
      }
      return null;
    },
    {
      enabled: !!memberId,
    }
  );

  return { member, selectedFiles, setSelectedFiles, isLoading, isError };
};
