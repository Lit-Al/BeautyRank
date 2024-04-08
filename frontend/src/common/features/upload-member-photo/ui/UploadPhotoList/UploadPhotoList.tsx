import { ChangeEvent, FC } from 'react';
import { IPhoto } from '../../lib';
import Image from 'next/image';
import styles from './UploadPhotoList.module.scss';

interface IPhotoListProps {
  photos: IPhoto[];
  onChange: (index: number) => (event: ChangeEvent<HTMLInputElement>) => void;
  getImageSrc: (index: number) => string;
}

const UploadPhotoList: FC<IPhotoListProps> = ({
  photos,
  onChange,
  getImageSrc,
}) => (
  <ul className={styles.upload_photo__list}>
    {photos.map((photo, index) => (
      <li key={index} className={styles.upload_photo__item}>
        <label className={styles.upload_photo__label}>
          <input type="file" accept="image/*,.mpo" onChange={onChange(index)} />
          <Image
            src={getImageSrc(index)}
            alt="Выбранное фото"
            width={80}
            height={80}
            className={styles.upload_photo__image}
            quality={75}
          />
          <span>{photo.name}</span>
        </label>
      </li>
    ))}
  </ul>
);

export default UploadPhotoList;
