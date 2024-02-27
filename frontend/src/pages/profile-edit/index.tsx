import styles from './profile-edit.module.scss';
import { Layout } from 'common/shared/ui/layout';
import { ProfileEditForm } from 'common/features/profile-edit/ui/ProfileEditForm';

function ProfilePageEdit() {

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Редактирование Профиля">
        <ProfileEditForm />
      </Layout>
    </div>
  );
}

export default ProfilePageEdit;
