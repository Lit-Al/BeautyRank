import type { AppProps } from 'next/app';
import 'common/shared/styles/globals.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { userAtom } from 'store';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import Head from 'next/head';
import { PageTransition } from 'common/shared/ui/page-transition-box';

function MyApp({ Component, pageProps }: AppProps) {
  const user = useAtomValue(userAtom);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, refetchInterval: false },
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const router = require('next/router').default;
      if (!user) {
        router.replace('/');
      } else if (user.image === null) {
        router.replace('/avatar');
      }
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="icon" type="image/x-icon" href="/images/BR.ico" />
      </Head>
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </QueryClientProvider>
  );
}

export default MyApp;
