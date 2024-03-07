import { IMember, MemberCard } from 'common/entities/member';
import { getMembers } from 'common/shared/api/members';
import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { champAtom, userAtom } from 'store';
import styles from './membersList.module.scss';
import { Loader } from 'common/shared/ui/loader';

export const MembersList = () => {
  const [members, setMembers] = useState<IMember[]>();
  const [currentMasterMembers, setCurrentMasterMembers] = useState<IMember[]>(
    []
  );
  const [otherMasterMembers, setOtherMasterMembers] = useState<IMember[]>([]);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ?.role === 'Судья';
  const user = useAtomValue(userAtom);

  const getMembersList = useMutation(async () => {
    try {
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
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getMembersList.mutateAsync();
  }, []);

  return (
    <>
      {members ? (
        <>
          {userIsStaff ? (
            <>
              <ul
                className={`${styles.members__list} ${
                  userIsStaff && styles.members__list_staff
                }`}
              >
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className={styles.members__title}>Ваши работы:</h3>
              <ul className={styles.members__list}>
                {currentMasterMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </ul>
              <h3 className={styles.members__title}>Работы других мастеров:</h3>
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
                <Loader />
              )}
            </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
