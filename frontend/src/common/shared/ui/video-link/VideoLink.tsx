import { IMember } from 'common/entities/member';
import Link from 'next/link';
import styles from './VideoLink.module.scss';
import React from 'react';

export const VideoLink = ({ member }: { member: IMember }) => {
  return (
    <>
      {member?.url_message_video ? (
        <Link
          href={member?.url_message_video}
          className={styles.result__video_link}
        >
          Посмотрите Видео Работы
        </Link>
      ) : null}
    </>
  );
};
