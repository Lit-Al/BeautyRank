import { useMutation } from 'react-query';
import { IMember } from 'common/entities/member';
import { useState, useEffect } from 'react';
import { getMember } from 'common/shared/api/members';
import { IPhoto } from '../lib/types';

export const useMember = (memberId: number) => {
  const [member, setMember] = useState<IMember>();
  const [selectedFiles, setSelectedFiles] = useState<IPhoto[]>([]);

  const getMemberItem = useMutation(async () => {
    try {
      if (memberId) {
        const { data } = await getMember(memberId);
        console.log(data);

        setMember(data);
        setSelectedFiles(
          Array(
            data.nomination_info.after.length +
              data.nomination_info.before.length
          ).fill(null)
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getMemberItem.mutateAsync();
  }, [memberId]);

  return { member, selectedFiles, setSelectedFiles, getMemberItem };
};
