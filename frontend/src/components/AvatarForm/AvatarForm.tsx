import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { avatarExistAtom, userAtom, avatarAtom } from '../../store/store';
import Button from '../UI/Button/Button';
import styles from './AvatarForm.module.scss';
import MockAdapter from 'axios-mock-adapter';
import Avatar from '../AvatarEditor/AvatarEditor';
import { useEffect } from 'react';

const AvatarForm: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const { handleSubmit } = useForm<FormData>();
  const avatar = useAtomValue(avatarAtom);
  const presenceAvatar = useAtomValue(avatarExistAtom);

  // const mock = new MockAdapter(axios);

  // useEffect(() => {
  //   console.log(user);

  // }, [])

  // mock
  //   .onPut(`http://192.168.24.52:8000/api/photo_selection/${user?.id}/`)
  //   .reply(() => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve([
  //           200,
  //           {
  //             image: avatar,
  //           },
  //         ]);
  //       }, 500); // Задержка ответа на 1 секунду
  //     });
  //   });

  const uploadAvatar = async (formData: FormData) => {
    console.log(`http://192.168.110.52:8000/api/v1/users/${user?.id}/`);

    try {
      const response: AxiosResponse = await axios.put(
        `http://192.168.110.52:8000/api/v1/users/${user?.id}/`,
        { image: formData }
      );

      // Обработка ответа от сервера
      setUser((prevUser) => {
        console.log(prevUser);
        console.log(response.data.image);
        if (prevUser) {
          return { ...prevUser, image: response.data.image };
        }
        return prevUser;
      });
      router.push('user');
    } catch (error: any) {
      // Обработка ошибок
      console.error(error);
    }
  };

  const mutation = useMutation(uploadAvatar);

  const onSubmit = () => {
    if (avatar && user) {
      console.log(avatar);

      const formData = new FormData();
      formData.append('image', avatar);
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
      <Button disabled={!presenceAvatar}>Войти</Button>
      <h2 style={{ opacity: 0.5 }}>{mutation.isLoading ? 'Loading...' : ''}</h2>
    </form>
  );
};

export default AvatarForm;
