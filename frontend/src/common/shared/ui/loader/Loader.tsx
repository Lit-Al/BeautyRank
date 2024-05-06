import styles from './Loader.module.scss';

export const Loader = ({top}: {top?: string}) => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__container} style={{top: top}}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
