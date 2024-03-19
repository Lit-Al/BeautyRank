import React from 'react';
import styles from './BeautyLoader.module.scss';
import Image from 'next/image';

export const BeautyLoader = () => {
  return (
    <div className={styles.beauty_loader}>
      <Image
        src="/images/BR_loader.gif"
        alt="Ожидайте..."
        width={120}
        height={70}
      />
    </div>
  );
};
