import type { NextPage } from 'next';
import Image from 'next/image';

import styles from './index.module.scss';
import LoginForm from '../components/LoginForm/LoginForm';
import logo from '../../public/images/logo.svg';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';

const Home: NextPage = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <Head>
        <title>Авторизация</title>
      </Head>
      <div className={styles.AuthBack}>
        <div className="container">
          <Image
            src={logo}
            className={styles.logo}
            alt="Логотип"
            width={196}
            height={104}
          />
          <h1 className={styles.auth_title}>Добрый день!</h1>
          <QueryClientProvider client={queryClient}>
            <LoginForm />
          </QueryClientProvider>
        </div>
      </div>
    </>
  );
};

export default Home;
