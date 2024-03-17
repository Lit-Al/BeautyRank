import { Layout } from 'common/shared/ui/layout';
import { ProfileEditForm } from 'common/features/profile-edit/ui/ProfileEditForm';
import { useEffect } from 'react';

function ProfilePageEdit() {
  useEffect(() => {
    document.body.classList.add('profile-page');
    return () => {
      document.body.classList.remove('profile-page');
    };
  }, []);
  return (
    <Layout pageTitle="Редактирование Профиля">
      <ProfileEditForm />
    </Layout>
  );
}

export default ProfilePageEdit;
