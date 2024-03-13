import React from 'react';
import styles from './MemberPhotosList.module.scss';
import { IPhoto } from 'common/features/upload-member-photo/lib';
import { MemberPhotosListContent } from '../member-photos-list-content/MemberPhotosListContent';

export const MemberPhotosList = ({
  memberPhotos,
}: {
  memberPhotos: IPhoto[];
}) => {
  return (
    <div className={styles.member_photos__box}>
      <div>
        <p className={styles.member_photos__separation}>ДО</p>
        <MemberPhotosListContent photos={memberPhotos} beforeAfter="BE" />
      </div>
      <div>
        <p className={styles.member_photos__separation}>ПОСЛЕ</p>
        <MemberPhotosListContent photos={memberPhotos} beforeAfter="AF" />
      </div>
    </div>
  );
};
