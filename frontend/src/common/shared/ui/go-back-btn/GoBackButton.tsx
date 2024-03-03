import React, { useEffect, useState } from 'react';
import styles from './GoBackButton.module.scss';
import router from 'next/router';

export const GoBackButton = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <button className={styles.UI_button} onClick={() => router.back()}>
          Назад
        </button>
      )}
    </>
  );
};
