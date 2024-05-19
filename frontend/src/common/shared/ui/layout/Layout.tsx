import { ReactNode } from 'react';
import styles from './Layout.module.scss';
import Head from 'next/head';
import { PageTransitionBox } from '../page-transition-box';
import classNames from 'classnames';
interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
  fullHeight?: boolean;
}

export const Layout = ({ pageTitle, children, fullHeight }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PageTransitionBox>
        <div
          className={classNames(styles.container, {
            [styles.container_full_height]: fullHeight,
          })}
        >
          {children}
        </div>
      </PageTransitionBox>
    </>
  );
};
