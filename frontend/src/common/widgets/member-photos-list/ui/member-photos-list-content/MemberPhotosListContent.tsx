import React, { FC } from 'react';
import Image from 'next/image';
import styles from './MemberPhotosListContent.module.scss';
import { IMemberPhotoList } from 'common/features/evaluation-member/lib';

export const MemberPhotosListContent: FC<IMemberPhotoList> = ({
  photos,
  beforeAfter,
}) => {
  return (
    <ul className={styles.member_photos__list}>
      {photos
        .filter((photo) => photo.before_after === beforeAfter)
        .map((photo) => (
          <li key={photo.id} className={styles.member_photos__item}>
            <Image
              className={styles.member_photos__img}
              src={photo.photo as string}
              width={100}
              height={100}
              alt={photo.name}
              quality={100}
              priority
              unoptimized
            />
            <span className={styles.member_photos__name}>{photo.name}</span>
          </li>
        ))}
    </ul>
  );
};
