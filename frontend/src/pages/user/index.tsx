import styles from './user.module.scss';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/store';
import { useState, useEffect } from 'react';
// import ModelList from "../../components/ModelList/ModelList";

function UserPage() {
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.UserBack}>
      <div className="container">
        {user && isClient ? (
          <>
            {user?.image && (
              <img
                src={`http://192.168.110.52:8000/${user.image}`}
                // src={user.image}
                className={styles.user_avatar}
                alt={`${user.first_name} ${user.last_name}`}
              />
            )}
            <p className={styles.user_name}>
              {user?.first_name} {user?.last_name}
            </p>
            {user?.is_staff ? (
              <>
                <h1 className={styles.user_role}>Судья</h1>
                <p className={styles.user_action}>
                  Выберите модель для оценки работы
                </p>
              </>
            ) : (
              <>
                <h1 className={styles.user_role}>Мастер</h1>
                <p className={styles.user_action}>
                  Выберите модель с которой работаете
                </p>
                {/* <ModelList></ModelList> */}
              </>
            )}
          </>
        ) : (
          <h2 style={{ opacity: 0.5, marginTop: '200px' }}>Loading...</h2>
        )}
      </div>
    </div>
  );
}

export default UserPage;
