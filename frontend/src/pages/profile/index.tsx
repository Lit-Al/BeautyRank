import styles from './profile.module.scss';
import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';
import { useMutation } from 'react-query';
import { getModels } from 'common/shared/api/models';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { UserName } from 'common/shared/ui/user-name';
import { UserRole } from 'common/shared/ui/user-role';
import { UserAction } from 'common/shared/ui/user-action';
import { Layout } from 'common/shared/ui/layout';
import Link from 'next/link';
import { useEffect } from 'react';

function ProfilePage() {
  const user = useAtomValue(userAtom);
  const champ = useAtomValue(champAtom);

  const getModelsList = useMutation(async () => {
    try {
      const { data } = await getModels();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getModelsList.mutateAsync();
  }, []);
  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Профиль">
        <>
          <Link href="/profile-edit">
            <Avatar />
          </Link>
          <UserName />
          <UserRole />
          <UserAction role={champ?.role!} />
        </>
      </Layout>
    </div>
  );
}

export default ProfilePage;
