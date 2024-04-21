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
import { motion, AnimatePresence } from 'framer-motion';

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
  }, [showCodePage, setValue]);

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
        console.error(error);
        throw error;
      }
    }
  );

  const onSubmitNumber = async (data: LoginFormValues) => {
    if (!data.phone || data.phone.length < 11) {
      setError('phone', {
        type: 'custom',
        message: 'Номер введён не полностью!',
      });
    } else {
      try {
        const phoneNumber = data.phone;
        await loginUserMutation.mutateAsync(phoneNumber);
        setShowCodePage(true);
      } catch (error: any) {
        setError('phone', {
          type: 'custom',
          message: 'Упс! что-то пошло не так! Попробуйте ещё раз!',
        });
      }
    }
  };

  const onSubmitCode = async (data: LoginFormValues) => {
    try {
      if (data.code.length < 4) {
        throw new Error('Вы не ввели весь код!');
      }
      await verifyCodeMutation.mutateAsync(data);
    } catch (error: any) {
      console.error(error);

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
      <AnimatePresence mode="wait">
        {showCodePage ? (
          // Код подтверждения
          <motion.div
            key="codePage"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
            className={styles.code_box}
          >
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
                render={({ field }) => (
                  <Input
                    autofocus
                    icon="lock"
                    error={errors.code?.message}
                    type="number"
                    maxLength={4}
                    placeholder={
                      errors.code
                        ? errors.code.message
                        : 'Код сообщения из звонка'
                    }
                    {...field}
                  />
                )}
              />
              <Button loading={verifyCodeMutation.isLoading}>ВОЙТИ</Button>
              {verifyCodeMutation.isLoading && <Loader />}
            </form>
          </motion.div>
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
            <Button loading={loginUserMutation.isLoading}>Получить код</Button>
            {loginUserMutation.isLoading && <Loader />}
          </form>
        )}
      </AnimatePresence>
    </>
  );
};
