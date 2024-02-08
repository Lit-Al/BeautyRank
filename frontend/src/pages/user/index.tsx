import styles from './user.module.scss';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/store';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../api/endpoints';
import { useMutation } from 'react-query';
import { getModels } from 'api/models';
import Head from 'next/head';

function UserPage() {
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    getModelsList.mutate(); // Вызываем функцию getModelsList при заходе на страницу
  }, []);

  const getModelsList = useMutation(async () => {
    try {
      const response = await getModels();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <>
      <Head>
        <title>Профиль</title>
      </Head>
      <div className={styles.UserBack}>
        <div className="container">
          {user && isClient ? (
            <>
              {user?.image && (
                <img
                  src={`${BASE_URL}${user.image}`}
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
                </>
              )}
            </>
          ) : (
            <h2 style={{ opacity: 0.5, marginTop: '200px' }}>Loading...</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default UserPage;
