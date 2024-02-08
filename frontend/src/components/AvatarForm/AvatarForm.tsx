import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, accessTokenAtom } from '../../store/store';
import Button from '../UI/Button/Button';
import styles from './AvatarForm.module.scss';
import Avatar from '../AvatarEditor/AvatarEditor';
import { setAvatar } from '../../api/users';

const AvatarForm: React.FC = () => {
  const setUser = useSetAtom(userAtom);
  const { handleSubmit } = useForm<FormData>();
  const user = useAtomValue(userAtom);
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
      console.log(user);
      const formData = new FormData();
      formData.append('image', user.image);
      console.log(formData);
      mutation.mutate(formData);
    }
  };

  return (
    <form
      encType="multipart/form-data"
      className={styles.auth_form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Avatar />
      <Button disabled={!user?.image}>Войти</Button>
      <h2 style={{ opacity: 0.5 }}>{mutation.isLoading ? 'Loading...' : ''}</h2>
    </form>
  );
};

export default AvatarForm;
