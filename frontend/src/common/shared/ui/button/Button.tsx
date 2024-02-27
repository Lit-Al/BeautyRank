import React, { useEffect, useState } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
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
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
};
