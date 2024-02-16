import styles from './profile-edit.module.scss';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { useEffect, useState } from 'react';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { Loader } from 'common/shared/ui/loader';
import { Layout } from 'common/shared/ui/layout';
import Input from 'common/shared/ui/input/Input';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from 'common/shared/ui/button';
import AvatarCropper from 'common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper';

function ProfilePageEdit() {
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({});

  interface IProfileValues {
    phone: string;
    code: string;
  }

  const name = useWatch({ control, name: 'name' });
  const lastname = useWatch({ control, name: 'lastname' });
  const validationUserFlag = {
    name: /[^\p{L}]/u.test(name),
    lastname: /[^\p{L}]/u.test(lastname),
  };

  const isButtonDisabled = !name || !lastname;

  const onSubmitProfile = (data: any) => {
    console.log(data);
    console.log(errors);
  };

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Редактирование Профиля">
        {user && isClient ? (
          <>
            <form
              encType="multipart/form-data"
              className={styles.profile__form}
              onSubmit={handleSubmit(onSubmitProfile)}
            >
              <AvatarCropper>
                <Avatar className={styles.avatar} />
              </AvatarCropper>

              <div className={styles.profile__inputs}>
                <Controller
                  control={control}
                  name="name"
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
                        icon="lock"
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
                  name="lastname"
                  render={({ field }) => (
                    <>
                      <Input
                        maxLength={255}
                        minLength={2}
                        icon="lock"
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
              <Button
                className={styles.profile__button}
                disabled={
                  isButtonDisabled ||
                  validationUserFlag.lastname ||
                  validationUserFlag.name
                }
              >
                Завершить
              </Button>
            </form>
          </>
        ) : (
          <Loader />
        )}
      </Layout>
    </div>
  );
}

export default ProfilePageEdit;
