import React, { useEffect, useState } from 'react';
import styles from './CheckMark.module.scss';
function CheckMark() {
  const [showCheckMark, setShowCheckMark] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setShowCheckMark(false);
    }, 1000);
  }, []);

  return (
    <div
      className={`${styles.checkMark} ${showCheckMark ? '' : styles.fadeOut}`}
    >
      <svg
        className={styles.checkmark}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          className={styles.checkmark__circle}
          cx="26"
          cy="26"
          r="25"
          fill="none"
        />
        <path
          className={styles.checkmark__check}
          stroke="#fff"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
      <h1 className={styles.checkMark_title}>Успешно!</h1>
    </div>
  );
}

export default CheckMark;
