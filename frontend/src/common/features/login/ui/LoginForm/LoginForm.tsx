import { FC, useEffect, useState } from 'react';
import styles from './LoginForm.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { Input } from 'common/shared/ui/input';
import { Button } from 'common/shared/ui/button';
import { useSetAtom } from 'jotai';
import { refreshTokenAtom, userAtom } from 'store';
import { accessTokenAtom } from 'store';
import { login } from 'common/shared/api/auth';
import { getMe } from 'common/shared/api/users';
import { loginUser } from '../../model';
import { Loader } from 'common/shared/ui/loader';
import { LoginFormValues } from '../../model';
import router from 'next/router';
import PhoneInput from 'common/shared/ui/phone-input/PhoneInput';

export const LoginForm = () => {
  const [showCodePage, setShowCodePage] = useState(false);
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const setUser = useSetAtom(userAtom);
  const setAccess = useSetAtom(accessTokenAtom);
  const setRefresh = useSetAtom(refreshTokenAtom);

  useEffect(() => {
    // При переходе на новую форму сбрасываем значения полей
    setValue('code', '');
  }, [showCodePage]);

  const userQuery = useQuery('user', getMe, {
    onSuccess: ({ data }) => {
      setUser(data);
      if (data.image) {
        router.replace('/profile-edit');
      }
    },
    enabled: false,
  });

  const loginUserMutation = useMutation(['login'], async (phone: string) => {
    return await loginUser(phone);
  });

  const verifyCodeMutation = useMutation(
    ['sms_code'],
    async (loginData: LoginFormValues) => {
      try {
        const { data } = await login({
          password: loginData.code,
          username: loginData.phone,
        });
        setAccess(data.access);
        setRefresh(data.refresh);
        userQuery.refetch();

        return data;
      } catch (error) {
        // Обработка ошибки
        console.log(error);
        throw error;
      }
    }
  );

  const onSubmitNumber = async (data: LoginFormValues) => {
    try {
      const phoneNumber = data.phone;
      await loginUserMutation.mutateAsync(phoneNumber);
      setShowCodePage(true);
    } catch (error: any) {
      setError('phone', {
        type: 'custom',
        message: 'Упс! что-то пошло не так! Возможно номер - некорректный!',
      });
    }
  };

  const onSubmitCode = async (data: LoginFormValues) => {
    try {
      if (data.code.length < 4) {
        throw new Error('Вы не ввели весь код!');
      }
      await verifyCodeMutation.mutateAsync(data);
    } catch (error: any) {
      console.log(error);

      if (error?.message === 'Вы не ввели весь код!') {
        setValue('code', '');
        setError('code', {
          type: 'custom',
          message: 'Вы не ввели весь код!',
        });
      } else {
        setValue('code', '');
        setError('code', {
          type: 'custom',
          message: 'Упс! неверный код!',
        });
      }
    }
  };

  return (
    <>
      {showCodePage ? (
        // Код подтверждения
        <form
          className={styles.auth_form}
          onSubmit={handleSubmit(onSubmitCode)}
        >
          <label className={styles.auth_label}>
            Введите код из звонка, чтобы войти
          </label>
          <Controller
            control={control}
            name="code"
            defaultValue=" "
            render={({ field }) => (
              <Input
                autofocus
                icon="lock"
                error={errors.code?.message}
                type="number"
                maxLength={4}
                placeholder={
                  errors.code ? errors.code.message : 'Код сообщения из звонка'
                }
                {...field}
              />
            )}
          />
          <Button>ВОЙТИ</Button>
          {verifyCodeMutation.isLoading && <Loader />}
        </form>
      ) : (
        // Проверка номера
        <form
          className={styles.auth_form}
          onSubmit={handleSubmit(onSubmitNumber)}
        >
          <label className={styles.auth_label}>
            Введите свой номер телефона, чтобы войти
          </label>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput error={errors.phone?.message} {...field} />
            )}
          />
          <Button>Получить код</Button>
          {loginUserMutation.isLoading && <Loader />}
        </form>
      )}
    </>
  );
};
