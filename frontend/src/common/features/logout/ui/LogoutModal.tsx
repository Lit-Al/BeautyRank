import { Button } from 'common/shared/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import router from 'next/router';
import styles from './LogoutModal.module.scss';
import { useSetAtom } from 'jotai';
import { userAtom } from 'store';

export const LogoutModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const setStoreUser = useSetAtom(userAtom);

  const handleLogout = () => {
    setStoreUser(null);
    onClose();
    router.replace('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className={styles.blur} onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className={styles.modal_exit}
          >
            <p>Вы уверены, что хотите выйти из сервиса?</p>
            <div className={styles.modal__buttons}>
              <Button onClick={onClose}>Отмена</Button>
              <Button className={styles.exit_button} onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
