import styles from './Loader.module.scss';
import cn from 'classnames';

export const Loader = ({ fullPage = false }: { fullPage?: boolean }) => {
  return (
    <div className={styles.loader}>
      <div
        className={cn(styles.loader__container, {
          [styles.loader__container_full_page]: fullPage,
        })}
      >
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
