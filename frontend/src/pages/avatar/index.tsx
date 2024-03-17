import { useEffect, useState } from 'react';
import styles from './avatar.module.scss';
import AvatarForm from 'common/features/select-avatar/ui/AvatarForm/AvatarForm';
import CheckMark from 'common/shared/ui/checkmark-animation/CheckMark';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Logo } from 'common/shared/ui/logo';
import { Layout } from 'common/shared/ui/layout';

export default function AvatarPage() {
  const queryClient = new QueryClient();
  const [showCheckMark, setShowCheckMark] = useState(false);

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

    document.body.classList.add('avatar-page');

    return () => {
      document.body.classList.remove('avatar-page');
    };
  }, []);

  return (
    <>
      {showCheckMark && <CheckMark />}
      <Layout pageTitle="Выбор Аватара">
        <Logo />
        <h1 className={styles.auth_title}>Красота!</h1>
        <QueryClientProvider client={queryClient}>
          <AvatarForm />
        </QueryClientProvider>
      </Layout>
    </>
  );
}
