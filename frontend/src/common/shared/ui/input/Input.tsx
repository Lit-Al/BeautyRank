import { ChangeEvent, ForwardRefRenderFunction, Ref } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  pattern?: string;
  error?: string | boolean;
  icon?: string;
  maxLength?: number;
  minLength?: number;
  ref?: Ref<HTMLInputElement>;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onInput?: any;
  autofocus?: boolean;
  autoComplete?: string;
}

function checkInputLength(event: ChangeEvent<HTMLInputElement>) {
  const input = event.target;
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength);
  }
}

export const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({
  type = 'text',
  minLength,
  placeholder,
  maxLength,
  value,
  onChange,
  onInput = checkInputLength,
  pattern,
  error,
  icon = '',
  autofocus,
  required = false,
  ref,
  autoComplete = 'off',
}) => {
  return (
    <div
      className={`${styles.input_box} ${styles[icon]} ${
        error && styles[icon + '_error']
      }`}
    >
      <input
        autoFocus={autofocus}
        className={`${styles.UI_input} ${error ? styles.UI_input_error : ''}`}
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
        autoComplete={autoComplete}
      />
    </div>
  );
};
