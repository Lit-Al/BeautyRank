import styles from './profile.module.scss';
import { useAtomValue } from 'jotai';
import { champAtom } from 'store';
import { useMutation } from 'react-query';
import { getModels } from 'common/shared/api/models';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { UserName } from 'common/shared/ui/user-name';
import { UserRole } from 'common/shared/ui/user-role';
import { UserAction } from 'common/shared/ui/user-action';
import { Layout } from 'common/shared/ui/layout';
import Link from 'next/link';
import { ModelsList } from 'common/widgets/models-list';

function ProfilePage() {
  const champ = useAtomValue(champAtom);

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Профиль">
        <Link className={styles.profile__avatar} href="/profile-edit">
          <Avatar edit />
        </Link>
        <UserName />
        <UserRole />
        <UserAction role={champ?.role!} />
        <ModelsList />
      </Layout>
    </div>
  );
}

export default ProfilePage;
