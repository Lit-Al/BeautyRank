import type { NextPage } from 'next';
import styles from './index.module.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Logo } from 'common/shared/ui/logo';
import { Layout } from 'common/shared/ui/layout';
import { LoginForm } from 'common/features/login/ui/LoginForm';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { useEffect } from 'react';
import router from 'next/router';

const Home: NextPage = () => {
  const queryClient = new QueryClient();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    user && user.image && router.replace('/profile');
  }, []);

  return (
    <div className={styles.AuthBack}>
      <Layout pageTitle="Авторизация">
        <Logo />
        <h1 className={styles.auth_title}>Добрый день!</h1>
        <QueryClientProvider client={queryClient}>
          <LoginForm />
        </QueryClientProvider>
      </Layout>
    </div>
  );
};

export default Home;
