import { smsCall } from 'common/shared/api/auth';

export const loginUser = async (phone: string) => {
  try {
    const { data } = await smsCall(phone);
    return data;
  } catch (error) {
    // Обработка ошибки
    console.log(error);
    throw error;
  }
};
