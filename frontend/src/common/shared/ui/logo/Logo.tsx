import Image from 'next/image';
import logo from '@public/images/logo.svg';
import styles from './Logo.module.scss';

export const Logo = () => {
  return (
    <Image
      src={logo}
      className={styles.logo}
      alt="Логотип"
      width={196}
      height={104}
    />
  );
};
