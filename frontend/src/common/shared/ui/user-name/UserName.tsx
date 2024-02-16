import React from 'react';
import styles from './UserName.module.scss';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';

export const UserName = () => {
  const user = useAtomValue(userAtom);

  return (
    <p className={styles.user_name}>
      {user?.first_name} {user?.last_name}
    </p>
  );
};
