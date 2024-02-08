import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <button className={styles.UI_button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
