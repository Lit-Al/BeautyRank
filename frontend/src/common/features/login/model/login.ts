import { ENDPOINTS } from 'common/shared/api/endpoints';
import { axiosInstanse } from 'common/shared/api/instanse';
import { ILoginRequest } from 'common/shared/types';

export const loginUser = async (phone: string) => {
  try {
    const { data } = await axiosInstanse.post<ILoginRequest>(
      ENDPOINTS.AUTH.SMS_CALL,
      {
        phone_number: phone,
      }
    );
    console.log(data.password);

    return data;
  } catch (error) {
    // Обработка ошибки
    console.log(error);
    throw error;
  }
};
