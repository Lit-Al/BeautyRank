import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, accessTokenAtom } from 'store';
import { Button } from 'common/shared/ui/button';
import styles from './AvatarForm.module.scss';
import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';
import { setUser } from 'common/shared/api/users';
import { Loader } from 'common/shared/ui/loader';
import { base64ToFileFunction } from 'common/shared/helpers';
import router from 'next/router';
import { IUser } from 'common/shared/types';

const AvatarForm: React.FC = () => {
  const setStoreUser = useSetAtom(userAtom);
  const { handleSubmit } = useForm<FormData>();
  const user = useAtomValue(userAtom);
  const avatarFile = user?.image && base64ToFileFunction(user.image);
  const accessToken = useAtomValue(accessTokenAtom);

  const uploadAvatar = async (formData: IUser) => {
    try {
      if (accessToken) {
        try {
          const { data } = await setUser(formData);
          setStoreUser(data);
          router.replace('/profile-edit');
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error: any) {
      // Обработка ошибок
      console.error(error);
    }
  };

  const mutation = useMutation(uploadAvatar);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('image', avatarFile!);
    mutation.mutate(formData as unknown as IUser);
  };

  return (
    <form
      encType="multipart/form-data"
      className={styles.auth_form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AvatarCropper />
      <Button disabled={!user?.image}>Войти</Button>
      {mutation.isLoading && <Loader />}
    </form>
  );
};

export default AvatarForm;
