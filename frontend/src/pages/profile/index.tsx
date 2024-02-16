import styles from './profile.module.scss';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { getModels } from 'common/shared/api/models';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { Loader } from 'common/shared/ui/loader';
import { UserName } from 'common/shared/ui/user-name';
import { UserRole } from 'common/shared/ui/user-role';
import { UserAction } from 'common/shared/ui/user-action';
import { Layout } from 'common/shared/ui/layout';

function ProfilePage() {
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
    <div className={styles.UserBack}>
      <Layout pageTitle="Профиль">
        {user && isClient ? (
          <>
            <Avatar />
            <UserName />
            <UserRole />
            <UserAction is_staff={user?.is_staff} />
          </>
        ) : (
          <Loader />
        )}
      </Layout>
    </div>
  );
}

export default ProfilePage;
