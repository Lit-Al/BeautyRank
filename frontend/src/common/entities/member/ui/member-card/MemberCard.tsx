import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MemberCard.module.scss';
import unknownAvatar from '@public/images/unknown-avatar.svg';
import { declineNumberOfBalls } from 'common/shared/helpers';
import { MemberCardProps } from 'common/entities/member/lib';
import { BASE_API_URL } from 'common/shared/api/endpoints';
import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';
import { getMemberResults } from 'common/shared/api/assessments';
import { useQuery } from 'react-query';
import { Loader } from 'common/shared/ui/loader';

export const MemberCard: FC<MemberCardProps> = ({ member }) => {
  const user = useAtomValue(userAtom);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ?.role === 'Судья';
  const memberCurrent = member.member.includes(user?.last_name!);
  const memberPreview = member.preview
    ? `${BASE_API_URL}${member.preview}`
    : unknownAvatar;

  const { data: resultData, isLoading } = useQuery(
    ['memberResult', member.id],
    () => getMemberResults(member.id),
    {
      enabled: !!member.id,
    }
  );

  const isMyMark = () => {
    if (userIsStaff) {
      return resultData?.data
        .map((result: any) => result.event_staff)
        .includes(user?.id);
    }
    return true;
  };

  const memberLink = () => {
    if (memberCurrent && !member.preview) {
      return `/upload-photo/${member.id}`;
    }
    if (userIsStaff && member.preview && !isMyMark()) {
      return `/member-evaluation/${member.id}`;
    } else {
      return `/member-result/${member.id}`;
    }
  };

  const memberPoints = () => {
    if (!isMyMark()) {
      return 'оцените работу';
    }
    if (member.preview && member.result_sum) {
      return `${member.result_sum} ${declineNumberOfBalls(member.result_sum)}`;
    }
    if (!member.preview) {
      return 'выберите фото';
    } else {
      return 'оценивается';
    }
  };

  const notPhotoMembers = () => {
    if (!member.preview && userIsStaff) {
      return true;
    }
    return false;
  };

  return (
    <>
      {!isLoading ? (
        <>
          {!notPhotoMembers() && (
            <li className={styles.members__item} key={member.id}>
              <Link
                href={memberLink()}
                className={`${styles.members__content} ${
                  !memberCurrent &&
                  !userIsStaff &&
                  styles.members__content_other
                } ${
                  member.result_sum > 0 &&
                  isMyMark() &&
                  styles.members__content_done
                }`}
              >
                <span className={styles.members__number}>№{member.id}</span>

                <div className={styles.members__service}>
                  <p className={styles.members__nomination}>
                    {`${member.nomination} ${member.category}`}
                  </p>
                  <span className={styles.members__points}>
                    {memberPoints()}
                  </span>
                </div>
                <Image
                  width={55}
                  height={55}
                  className={styles.members__avatar}
                  src={memberPreview}
                  alt={`${(member.nomination, member.category)}`}
                  quality={100}
                />
              </Link>
            </li>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
