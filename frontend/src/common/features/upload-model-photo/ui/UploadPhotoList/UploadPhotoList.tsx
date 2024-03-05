import React from 'react';
import { IPhoto } from '../../model/types';
import Image from 'next/image';
import styles from './UploadPhotoList.module.scss';

interface IPhotoListProps {
  photos: IPhoto[];
  onChange: (
    index: number
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  getImageSrc: (index: number) => string;
}

const UploadPhotoList: React.FC<IPhotoListProps> = ({
  photos,
  onChange,
  getImageSrc,
}) => (
  <ul className={styles.upload_photo__list}>
    {photos.map((photo, index) => (
      <li key={index} className={styles.upload_photo__item}>
        <label className={styles.upload_photo__label}>
          <input type="file" onChange={onChange(index)} />
          <Image
            src={getImageSrc(index)}
            alt="Выбранное фото"
            width={80}
            height={80}
            className={styles.upload_photo__image}
          />
          <span>{photo.name}</span>
        </label>
      </li>
    ))}
  </ul>
);

export default UploadPhotoList;
