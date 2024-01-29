import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  pattern?: string;
  error?: string;
  icon?: string;
  maxLength?: number;
  minLength?: number;
  ref?: any;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: any;
}

function checkInputLength(event: React.ChangeEvent<HTMLInputElement>) {
  const input = event.target;
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength);
  }
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({
  type = 'text',
  minLength,
  placeholder,
  ref,
  maxLength,
  value,
  onChange,
  onInput = checkInputLength,
  pattern,
  error,
  icon = '',
  required = false,
}) => {
  return (
    <div
      className={`${styles.input_box} ${styles[icon]} ${
        error && styles[icon + '_error']
      }`}
    >
      <input
        className={`${styles.UI_input} ${error && styles.UI_input_error}`}
        type={type}
        placeholder={placeholder}
        value={value}
        pattern={pattern}
        required={required}
        ref={ref}
        maxLength={maxLength}
        minLength={minLength}
        onInput={onInput}
        onChange={onChange}
      />
    </div>
  );
};

export default React.forwardRef(Input);
