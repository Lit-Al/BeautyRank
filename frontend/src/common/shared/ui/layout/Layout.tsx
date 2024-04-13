import { ReactNode } from 'react';
import styles from './Layout.module.scss';
import Head from 'next/head';
import YandexMetrika from '../yandex-metrica/YandexMetrica';
import { PageTransitionBox } from '../page-transition-box';

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

export const Layout = ({ pageTitle, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <YandexMetrika />
        <title>{pageTitle}</title>
      </Head>
      <PageTransitionBox>
        <div className={styles.container}>{children}</div>
      </PageTransitionBox>
    </>
  );
};
