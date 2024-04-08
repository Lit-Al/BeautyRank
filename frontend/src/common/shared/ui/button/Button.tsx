import { FC, useEffect, useState } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  loading,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <button
          className={`${styles.UI_button} ${className}`}
          disabled={disabled || loading}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
};
