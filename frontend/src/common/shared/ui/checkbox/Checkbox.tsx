import styles from './Checkbox.module.scss';

export const Checkbox = ({
  onChange,
  checked,
}: {
  onChange: () => void;
  checked: boolean;
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      className={styles.UI_checkbox}
      onChange={onChange}
    />
  );
};
