import React from 'react';
import styles from './UserAction.module.scss';

export const UserAction = ({ is_staff }: { is_staff: boolean }) => {
  return is_staff ? (
    <p className={styles.user_action}>Выберите модель для оценки работы</p>
  ) : (
    <p className={styles.user_action}>Выберите модель с которой работаете</p>
  );
};
