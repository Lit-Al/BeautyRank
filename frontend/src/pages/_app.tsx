import type { AppProps } from 'next/app';
import 'common/shared/styles/globals.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { userAtom } from 'store';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const router = require('next/router').default;
      if (!user) {
        router.replace('/');
      } else if (!user.image) {
        router.replace('/avatar');
      }
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
