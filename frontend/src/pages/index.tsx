import type { NextPage } from 'next';
import styles from './index.module.scss';
import LoginForm from 'common/features/login/ui/LoginForm/LoginForm';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Logo } from 'common/shared/ui/logo';
import { Layout } from 'common/shared/ui/layout';

const Home: NextPage = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <div className={styles.AuthBack}>
        <Layout pageTitle="Авторизация">
          <Logo />
          <h1 className={styles.auth_title}>Добрый день!</h1>
          <QueryClientProvider client={queryClient}>
            <LoginForm />
          </QueryClientProvider>
        </Layout>
      </div>
    </>
  );
};

export default Home;
