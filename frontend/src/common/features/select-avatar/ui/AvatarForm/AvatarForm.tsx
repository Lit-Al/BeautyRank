import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { Button } from 'common/shared/ui/button';
import styles from './AvatarForm.module.scss';
import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';
import { FC } from 'react';
import { useRouter } from 'next/router';

const AvatarForm: FC = () => {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  return (
    <div className={styles.auth_form}>
      <AvatarCropper />
      <Button
        disabled={!user?.image}
        onClick={() => router.replace('./profile-edit')}
      >
        Войти
      </Button>
    </div>
  );
};

export default AvatarForm;
