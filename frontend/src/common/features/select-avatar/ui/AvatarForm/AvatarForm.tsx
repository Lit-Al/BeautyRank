import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, accessTokenAtom } from 'store';
import { Button } from 'common/shared/ui/button';
import styles from './AvatarForm.module.scss';
import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';
import { setUser } from 'common/shared/api/users';
import { Loader } from 'common/shared/ui/loader';
import router from 'next/router';
import { IUser } from 'common/shared/types';
import { FC } from 'react';

const AvatarForm: FC = () => {
  const setStoreUser = useSetAtom(userAtom);
  const { handleSubmit } = useForm<FormData>();
  const accessToken = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

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

  const mutation = useMutation(['user'], uploadAvatar);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('image', user?.image!);
    mutation.mutate(formData as unknown as IUser);
  };

  return (
    <form
      encType="multipart/form-data"
      className={styles.auth_form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AvatarCropper />
      <Button disabled={!(user?.image instanceof File)}>Войти</Button>
      {mutation.isLoading && <Loader />}
    </form>
  );
};

export default AvatarForm;
