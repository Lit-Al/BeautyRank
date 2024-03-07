import styles from './profile.module.scss';
import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { UserName } from 'common/shared/ui/user-name';
import { UserRole } from 'common/shared/ui/user-role';
import { UserAction } from 'common/shared/ui/user-action';
import { Layout } from 'common/shared/ui/layout';
import Link from 'next/link';
import { Loader } from 'common/shared/ui/loader';
import { useEffect, useState } from 'react';
import { MembersList } from 'common/widgets/members-list/';

function ProfilePage() {
  const champ = useAtomValue(champAtom);
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  });

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Профиль">
        {user && isClient ? (
          <>
            <Link className={styles.profile__avatar} href="/profile-edit">
              <Avatar edit />
            </Link>
            <UserName />
            <UserRole />
            <UserAction role={champ?.role!} />
            <MembersList />
          </>
        ) : (
          <Loader />
        )}
      </Layout>
    </div>
  );
}

export default ProfilePage;
