import { useEffect, useState } from 'react';
import styles from './UserRole.module.scss';
import { useAtomValue } from 'jotai';
import { champAtom } from 'store';

export const UserRole = () => {
  const [isClient, setIsClient] = useState(false);
  const champ = useAtomValue(champAtom);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return <>{isClient && <h3 className={styles.user_role}>{champ?.role}</h3>}</>;
};
