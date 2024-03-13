import React, { ReactNode } from 'react';
import styles from './Layout.module.scss';
import Head from 'next/head';

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

export const Layout = ({ pageTitle, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className={styles.container}>{children}</div>
    </>
  );
};
