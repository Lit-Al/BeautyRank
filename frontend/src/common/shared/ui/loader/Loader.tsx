import React from 'react';
import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__container}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

