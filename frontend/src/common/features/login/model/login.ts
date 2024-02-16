import axios from 'axios';
import { ENDPOINTS } from 'common/shared/api/endpoints';
import { axiosInstanse } from 'common/shared/api/instanse';
import { ILoginRequest } from 'common/shared/types';

export const loginUser = async (phone: string) => {
  try {
    const response = await axiosInstanse.post<ILoginRequest>(
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
    throw error;
  }
};
