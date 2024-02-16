import React from 'react';
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
  className,
}) => {
  return (
    <button
      className={`${styles.UI_button} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
