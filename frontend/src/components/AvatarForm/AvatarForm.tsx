import React, { useState } from 'react';
import styles from './AvatarForm.module.scss'
import axios, { AxiosResponse, AxiosError } from 'axios';
import Button from '../UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setImage } from '../../redux/userSlice';

const AvatarForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user); 
  const dispatch: AppDispatch = useDispatch(); 
  // Преобразование объекта пользователя в JSON-строку
  // const userJSON = JSON.stringify(user);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('id', user.id.toString());
      // formData.append('user', userJSON);
    
      axios.put(`http://192.168.24.52:8000/api/photo_selection/${user.id}/`, formData)
        .then((response: AxiosResponse) => {
          // Обработка ответа от сервера
          dispatch(setImage(response.data.image));
          navigate('/UserPage')
        })
        .catch((error: AxiosError) => {
          // Обработка ошибок
          console.error(error);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];      
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form encType='multipart/form-data' className={styles.auth_form} onSubmit={handleSubmit}>
      <label className={styles.auth_label}>Загрузите ваше лучшее фото Профиля
      <input className={styles.avatar_input} type="file" onChange={handleFileChange} accept="image/jpg, image/jpeg, image/png, image/svg"/>
      <span className={styles.avatar_input_style}>Выбрать фото</span>
      </label>
      {previewUrl && <img src={previewUrl} alt="Аватар" className={styles.avatar_preview} />}
      <Button disabled={!selectedFile} >Войти</Button>
    </form>
  );
};

export default AvatarForm;