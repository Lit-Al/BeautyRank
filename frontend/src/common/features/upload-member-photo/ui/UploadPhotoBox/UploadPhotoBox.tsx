import React from 'react';
import styles from './UploadPhotoBox.module.scss';
import UploadPhotoList from '../UploadPhotoList/UploadPhotoList';

interface IPhotoBoxProps {
  title: string;
  photos: any[];
  onChange: (
    index: number
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  getImageSrc: (index: number) => string;
}

const UploadPhotoBox: React.FC<IPhotoBoxProps> = ({
  title,
  photos,
  onChange,
  getImageSrc,
}) => (
  <div className={styles.upload_photo__box}>
    <span>{title}</span>
    <UploadPhotoList
      photos={photos}
      onChange={onChange}
      getImageSrc={getImageSrc}
    />
  </div>
);

export default UploadPhotoBox;