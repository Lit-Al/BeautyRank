import React  from 'react';
import styles from './Input.module.scss'

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  pattern?: string;
  error?: string;
  icon?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | undefined
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, pattern, error, icon = '', required = false}) => {
  return (
    <div className={`${styles.input_box} ${styles[icon]} ${error && styles[icon+'_error']}`}>
      <input
      className={`${styles.UI_input} ${error && styles.UI_input_error}`}
      type={type}
      placeholder={placeholder}
      value={value}
      pattern={pattern}
      required={required}
      onChange={onChange}/>
    </div>

  )
};

export default Input;