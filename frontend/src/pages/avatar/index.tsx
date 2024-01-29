import { useEffect, useState } from 'react';
import styles from './avatar.module.scss';
import logo from '../../../public/images/logo.svg';
import Image from 'next/image';
import AvatarForm from '../../components/AvatarForm/AvatarForm';
import CheckMark from '../../components/Animations/CheckMark';
import { useAtom } from 'jotai';
import { userAtom } from '../../store/store';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function AvatarPage() {
  const queryClient = new QueryClient();
  const [user] = useAtom(userAtom);

  const [showCheckMark, setShowCheckMark] = useState(true);

  let isFirstVisit = false;
  if (typeof window !== 'undefined') {
    isFirstVisit = !sessionStorage.getItem('visited');
  }

  useEffect(() => {
    if (isFirstVisit) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('visited', 'true');
        setShowCheckMark(true);
      }
    }
    setTimeout(() => {
      setShowCheckMark(false);
    }, 2000);
  }, []);

  return (
    <div className={user?.is_staff ? styles.AuthBack_staff : styles.AuthBack}>
      {showCheckMark && <CheckMark />}
      <div className="container">
        <Image
          src={logo}
          className={styles.logo}
          alt="Логотип"
          width={196}
          height={105}
        />
        <h1 className={styles.auth_title}>Красота!</h1>
        <QueryClientProvider client={queryClient}>
          <AvatarForm />
        </QueryClientProvider>
      </div>
    </div>
  );
}
