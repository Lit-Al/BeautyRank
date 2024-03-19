import { IMember, MemberCard } from 'common/entities/member';
import { getMembers } from 'common/shared/api/members';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { champAtom, userAtom } from 'store';
import styles from './MembersList.module.scss';
import { Loader } from 'common/shared/ui/loader';
import { BeautyLoader } from 'common/shared/ui/beauty-loader';
import { EvaluationModal } from 'common/features/evaluation-member/ui';

export const MembersList = () => {
  const [members, setMembers] = useState<IMember[]>();
  const [currentMasterMembers, setCurrentMasterMembers] = useState<IMember[]>(
    []
  );
  const [otherMasterMembers, setOtherMasterMembers] = useState<IMember[]>([]);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ?.role === 'Судья';
  const user = useAtomValue(userAtom);

  const { isLoading: isMembersLoading } = useQuery(
    'membersList',
    async () => {
      const { data } = await getMembers(champ?.id!);
      setMembers(data);
      const currentMasterMembers = data.filter((member) =>
        member.member.includes(user?.last_name!)
      );
      const otherMasterMembers = data.filter(
        (member) => !member.member.includes(user?.last_name!)
      );

      setCurrentMasterMembers(currentMasterMembers);
      setOtherMasterMembers(otherMasterMembers);
      return data;
    },
    {
      enabled: !!champ?.id,
      refetchOnWindowFocus: true,
      //запрос раз в 5 минут
      refetchInterval: 50 * 60 * 100,
    }
  );

  if (isMembersLoading) {
    return <Loader />;
  }

  return (
    <>
      {userIsStaff ? (
        <>
          <ul
            className={`${styles.members__list} ${
              userIsStaff && styles.members__list_staff
            }`}
          >
            {members?.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </ul>
        </>
      ) : (
        <>
          {currentMasterMembers.length !== 0 ? (
            <>
              {champ?.role !== 'Организатор' && (
                <h3 className={styles.members__title}>Ваши работы:</h3>
              )}
              <ul className={styles.members__list}>
                {currentMasterMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </ul>
            </>
          ) : (
            <Loader />
          )}
          {champ?.role !== 'Организатор' && (
            <h3 className={styles.members__title}>Работы других мастеров:</h3>
          )}
          {otherMasterMembers.length !== 0 ? (
            <>
              <ul
                className={`${styles.members__list_other} ${styles.members__list}`}
              >
                {otherMasterMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </ul>
            </>
          ) : (
            <BeautyLoader />
          )}
        </>
      )}
      <EvaluationModal />
    </>
  );
};
