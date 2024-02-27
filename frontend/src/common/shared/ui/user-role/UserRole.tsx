import React, { useEffect, useState } from 'react';
import styles from './UserRole.module.scss';

export const UserRole = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return <>{isClient && <h3 className={styles.user_role}>Судья</h3>}</>;
};
