import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

export const PageTransitionBox = ({ children }: { children: ReactNode }) => {
  const { asPath } = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100); // задержка в 100 миллисекунд

    return () => {
      clearTimeout(timeout);
    };
  }, [asPath]);

  return (
    <AnimatePresence mode="wait">
      {isReady && (
        <motion.div
          key={asPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
