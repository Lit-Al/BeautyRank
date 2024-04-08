import { useEffect, useState } from 'react';
import styles from './UserAction.module.scss';
import { getUserIsStaff } from 'common/shared/constants';

export const UserAction = ({ role }: { role: string }) => {
  const [isClient, setIsClient] = useState(false);
  const USER_IS_STAFF = getUserIsStaff();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <>
          {USER_IS_STAFF && (
            <p className={styles.user_action}>
              Выберите модель для оценки работы
            </p>
          )}
        </>
      )}
    </>
  );
};
