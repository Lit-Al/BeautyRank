import React from 'react';
import styles from '../Input/Input.module.scss';
import InputMask from 'react-input-mask';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  pattern?: string;
  error?: string;
  icon?: string;
  maxLength?: number;
  ref?: any;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: any;
}

const PhoneInput: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({
  value,
  onChange,
  error,
  icon = '',
}) => {
  return (
    <div
      className={`${styles.input_box} ${styles[icon]} ${
        error && styles[icon + '_error']
      }`}
    >
      <InputMask
        className={`${styles.UI_input} ${error && styles.UI_input_error}`}
        mask={error ? '' : '+7 (999) 999-99-99'}
        placeholder={error ? error : '+7 (988) 515-15-55'}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default React.forwardRef(PhoneInput);
