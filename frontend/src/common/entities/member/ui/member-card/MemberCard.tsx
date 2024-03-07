import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MemberCard.module.scss';
import unknownAvatar from '@public/images/unknown-avatar.svg';
import { declineNumberOfBalls } from 'common/shared/helpers';
import { MemberCardProps } from 'common/entities/member/lib';
import { BASE_URL } from 'common/shared/api/endpoints';
import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const user = useAtomValue(userAtom);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ?.role === 'Судья';
  const memberCurrent = member.member.includes(user?.last_name!);
  const memberPreview = member.preview
    ? `${BASE_URL}${member.preview}`
    : unknownAvatar;

  const memberLink = () => {
    if (memberCurrent && !member.preview) {
      return `/upload-photo/${member.id}`;
    }
    if (userIsStaff && member.preview) {
      return `/member-evaluation/${member.id}`;
    } else {
      return '#';
    }
  };

  return (
    <li className={styles.members__item} key={member.id}>
      <Link
        href={memberLink()}
        className={`${styles.members__content} ${
          !memberCurrent && !userIsStaff && styles.members__content_other
        } ${member.result_sum > 0 && styles.members__content_done}`}
      >
        <span className={styles.members__number}>№{member.id}</span>
        <div className={styles.members__service}>
          <p className={styles.members__nomination}>
            {`${member.nomination} ${member.category}`}
          </p>
          <span className={styles.members__points}>
            {!member.preview || userIsStaff || !memberCurrent ? (
              <>
                {member.result_sum} {declineNumberOfBalls(member.result_sum)}
              </>
            ) : (
              'оценивается'
            )}
          </span>
        </div>
        <Image
          width={55}
          height={55}
          className={styles.members__avatar}
          src={memberPreview}
          alt={`${(member.nomination, member.category)}`}
        />
      </Link>
    </li>
  );
};
