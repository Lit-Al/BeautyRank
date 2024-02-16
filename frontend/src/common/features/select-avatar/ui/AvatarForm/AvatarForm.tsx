import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, accessTokenAtom } from 'store';
import { Button } from 'common/shared/ui/button';
import styles from './AvatarForm.module.scss';
import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';
import { setAvatar } from 'common/shared/api/users';
import { Loader } from 'common/shared/ui/loader';
import { base64ToFileFunction } from 'common/shared/helpers';

const AvatarForm: React.FC = () => {
  const setUser = useSetAtom(userAtom);
  const { handleSubmit } = useForm<FormData>();
  const user = useAtomValue(userAtom);
  const avatarFile = user?.image && base64ToFileFunction(user.image);

  const accessToken = useAtomValue(accessTokenAtom);

  const uploadAvatar = async (formData: FormData) => {
    try {
      if (accessToken) {
        try {
          const response = await setAvatar(formData);
          console.log(response);
          setUser(response.data);
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
    if (user?.image) {
      console.log(avatarFile);

      const formData = new FormData();
      formData.append('image', avatarFile!);
      mutation.mutate(formData);
    }
  };

  return (
    <form
      encType="multipart/form-data"
      className={styles.auth_form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AvatarCropper />
      <Button disabled={!avatarFile}>Войти</Button>
      {mutation.isLoading && <Loader />}
    </form>
  );
};

export default AvatarForm;
