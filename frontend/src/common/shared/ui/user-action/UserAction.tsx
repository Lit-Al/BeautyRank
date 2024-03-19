import React, { useEffect, useState } from 'react';
import styles from './UserAction.module.scss';

export const UserAction = ({ role }: { role: string }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <>
          {role === 'Судья' && (
            <p className={styles.user_action}>
              Выберите модель для оценки работы
            </p>
          )}
          {role === 'Мастер(участник)' && (
            <p className={styles.user_action}>
              Выберите модель с которой работаете
            </p>
          )}
        </>
      )}
    </>
  );
};
