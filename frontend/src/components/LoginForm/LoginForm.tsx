import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import Input from '../UI/Input/Input';
import PhoneInput from '../UI/PhoneInput/PhoneInput';
import Button from '../UI/Button/Button';
import { useSetAtom } from 'jotai';
import { refreshTokenAtom, userAtom } from '../../store/store';
import { accessTokenAtom } from '../../store/store';
import { login } from '../../api/auth';
import { getMe } from '../../api/users';
import { ENDPOINTS } from '../../api/endpoints';
import { ILoginRequest } from 'api/auth/types';

interface LoginFormValues {
  phone: string;
  code: string;
}

const LoginForm: React.FC = () => {
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

  const loginUserMutation = useMutation(async (phone: string) => {
    try {
      const response = await axios.post<ILoginRequest>(
        ENDPOINTS.AUTH.SMS_CALL,
        {
          phone_number: phone,
        }
      );
      console.log(response.data.password);

      return response;
    } catch (error) {
      // Обработка ошибки
      console.log(error);
      throw error; // Можно выбросить ошибку дальше, чтобы обработать ее в другом месте
    }
  });

  const verifyCodeMutation = useMutation(async (data: LoginFormValues) => {
    try {
      const response = await login({
        password: data.code,
        username: data.phone,
      });
      console.log(response.data);

      setAccess(response.data.access);
      setRefresh(response.data.refresh);

      try {
        const response = await getMe();
        console.log(response);
        setUser(response.data);
      } catch (e) {
        console.log(e);
      }

      return response;
    } catch (error) {
      // Обработка ошибки
      console.log(error);
      throw error;
    }
  });

  const onSubmitNumber = async (data: LoginFormValues) => {
    data.phone = data.phone?.replace(/\D/g, '');
    try {
      if (data.phone.length !== 11) {
        throw new Error('Вы не ввели полный номер телефона!');
      }

      await loginUserMutation.mutateAsync(data.phone);
      setShowCodePage(true);
    } catch (error: any) {
      if (error.message === 'Вы не ввели полный номер телефона!') {
        setValue('phone', '');
        setError('phone', {
          type: 'custom',
          message: 'Вы не ввели полный номер телефона!',
        });
      } else {
        setValue('phone', '');
        setError('phone', {
          type: 'custom',
          message: 'Упс! вашего номера нет в программе!',
        });
      }
    }
  };

  const onSubmitCode = async (data: LoginFormValues) => {
    data.phone = data.phone?.replace(/\D/g, '');
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
            render={({ field }) => (
              <Input
                icon="lock"
                error={errors.code?.message}
                type="number"
                maxLength={4}
                placeholder={
                  errors.code
                    ? errors.code.message
                    : 'Код из сообщения из звонка'
                }
                {...field}
              />
            )}
          />
          <Button>ВОЙТИ</Button>
          <h2 style={{ opacity: 0.5 }}>
            {verifyCodeMutation.isLoading ? 'Loading...' : ''}
          </h2>
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
              <PhoneInput
                icon="convert"
                error={errors.phone?.message}
                {...field}
              />
            )}
          />
          <Button>Получить код</Button>
          <h2 style={{ opacity: 0.5 }}>
            {loginUserMutation.isLoading ? 'Loading...' : ''}
          </h2>
        </form>
      )}
    </>
  );
};

export default LoginForm;
