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
    user?.image && router.replace('/profile');

    document.body.classList.add('home-page');

    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <Layout pageTitle="Авторизация">
      <Logo />
      <h1 className={styles.auth_title}>Добрый день!</h1>
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    </Layout>
  );
};

export default Home;
