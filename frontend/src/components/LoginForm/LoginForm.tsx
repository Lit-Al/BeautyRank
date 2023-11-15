import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.scss'
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import { useNavigate } from "react-router-dom";
import store, { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { UserState, setUser } from '../../redux/userSlice';
import { persistStore } from 'redux-persist';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const LoginForm: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showCodePage, setShowCodePage] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmitNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<any>('http://192.168.24.52:8000/api/index', {phone_number: phone}); 
      console.log(response.data.code);
      setShowCodePage(true)
    } catch (error: any) {
      setError('Упс! вашего номера нет в программе!');
      setPhone('');
      console.log(error);
    }
  };
  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<any>('http://192.168.24.52:8000/api/confirmation', { code: code, phone_number: phone });
      const userData: UserState = {
        id: response.data.user.id,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        is_staff: response.data.user.is_staff,
        image: response.data.user.image
      };
      dispatch(setUser(userData)); 
      console.log(userData);
      if (userData.image) {
        navigate("/userPage") 
      }
      else {
        navigate("/selectAvatar") 
      }
    } catch (error: any) {
      setCode('');
      setError('Упс! Код неверный, попробуйте еще');
    }
  };
  return (
    <>
    {showCodePage ? (
    // Код подтверждения
    <form className={styles.auth_form} onSubmit={handleSubmitCode}>
    <label className={styles.auth_label}>Введите код из звонка, чтобы войти</label>
    <Input icon='lock' error={error} required={true} type='tel' value={code} onChange={(e) => setCode(e.target.value)} pattern="[0-9]{4}" 
    placeholder={error ? (error) : ('Код из сообщения из звонка')}/>
    <Button>ВОЙТИ</Button>
    </form>
    ) : (
    // Проверка номера
    <form className={styles.auth_form} onSubmit={handleSubmitNumber}>
    <label className={styles.auth_label}>Введите свой номер телефона, чтобы войти</label>
    <Input icon='convert' required={true} error={error} type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} pattern="[7-8]{1}[0-9]{10}" 
    placeholder={error ? (error) : ('+7(988)515-15-55')}/>
    <Button>Получить код</Button>
    </form>
    )}
    </>
    );
};

export default LoginForm;
