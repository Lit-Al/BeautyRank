import { useCallback, useRef } from 'react';

const DELAY = 700;

export const useDebounce = (callback: Function) => {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const debouncedFn = useCallback(
    (...args: any) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        callback(...args);
      }, DELAY);
    },
    [callback]
  );

  return debouncedFn;
};
