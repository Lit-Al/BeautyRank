import type { AppProps } from 'next/app';
import '../styles/globals.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { userAtom } from '../store/store';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const user = useAtomValue(userAtom);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const router = require('next/router').default; // Импорт router только на клиентской стороне
  //     if (!user) {
  //       router.push('/');
  //     } else if (user && user.image) {
  //       router.push('/user');
  //     } else {
  //       router.push('/avatar');
  //     }
  //   }
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
