import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';
import { Button } from 'common/shared/ui/button';
import { Input } from 'common/shared/ui/input';
import { Controller, useForm, useWatch } from 'react-hook-form';
import styles from './ProfileEditForm.module.scss';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { literalValidation } from 'common/shared/helpers';
import { setUser } from 'common/shared/api/users';
import { champAtom, userAtom } from 'store';
import { useAtomValue, useSetAtom } from 'jotai';
import { IUser } from 'common/shared/types';
import { useMutation } from 'react-query';
import router from 'next/router';
import { ChampsList } from 'common/widgets/champs-list';
import { Loader } from 'common/shared/ui/loader';
import { FC, useEffect, useState } from 'react';

export const ProfileEditForm: FC = () => {
  const { control, handleSubmit } = useForm();
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);
  const setStoreUser = useSetAtom(userAtom);
  const selectedChamp = useAtomValue(champAtom);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const name = useWatch({
    control,
    defaultValue: user?.first_name,
    name: 'first_name',
  });
  const lastname = useWatch({
    control,
    defaultValue: user?.last_name,
    name: 'last_name',
  });

  const validationUserFlag = {
    name: literalValidation(name),
    lastname: literalValidation(lastname),
  };

  const isButtonDisabled =
    (!selectedChamp && selectedChamp === null) ||
    !name ||
    !lastname ||
    validationUserFlag.lastname ||
    validationUserFlag.name;

  const uploadUser = async (formData: IUser) => {
    try {
      try {
        const { data } = await setUser(formData);
        setStoreUser(data);
      } catch (e) {
        console.log(e);
      }
    } catch (error: any) {
      // Обработка ошибок
      console.error(error);
    }
  };

  const mutation = useMutation(['user'], uploadUser);

  const onSubmitProfile = (data: Partial<IUser>) => {
    const formData = new FormData();
    formData.append('image', user?.image!);
    formData.append('first_name', data.first_name!);
    formData.append('last_name', data.last_name!);
    mutation.mutate(formData as unknown as IUser);
    router.push('/profile');
  };

  return (
    <>
      <AvatarCropper>
        <Avatar edit user={user!} />
      </AvatarCropper>
      {user && isClient ? (
        <form
          encType="multipart/form-data"
          className={styles.profile__form}
          onSubmit={handleSubmit(onSubmitProfile)}
        >
          <div className={styles.profile__inputs}>
            <Controller
              control={control}
              defaultValue={user?.first_name}
              name="first_name"
              render={({ field }) => (
                <>
                  <label
                    className={`${styles.profile__validation} ${
                      validationUserFlag.name &&
                      styles.profile__validation_error
                    }`}
                  >
                    Недопустимые символы
                  </label>
                  <Input
                    maxLength={255}
                    minLength={2}
                    autofocus
                    icon="profile"
                    type="text"
                    placeholder="Имя"
                    error={validationUserFlag.name}
                    {...field}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue={user?.last_name}
              name="last_name"
              render={({ field }) => (
                <>
                  <Input
                    maxLength={255}
                    minLength={2}
                    icon="profile"
                    placeholder="Фамилия"
                    error={validationUserFlag.lastname}
                    {...field}
                  />
                  <label
                    className={`${styles.profile__validation} ${
                      validationUserFlag.lastname &&
                      styles.profile__validation_error
                    }`}
                  >
                    Недопустимые символы
                  </label>
                </>
              )}
            />
          </div>
          <h3>Доступные Чемпионаты:</h3>
          <ChampsList />
          <Button
            className={styles.profile__button}
            disabled={isButtonDisabled}
          >
            Подтвердить
          </Button>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};
