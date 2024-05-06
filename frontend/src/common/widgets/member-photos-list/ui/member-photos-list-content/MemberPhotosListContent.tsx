import { FC, useEffect } from 'react';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Fancybox } from '@fancyapps/ui';
import styles from './MemberPhotosListContent.module.scss';
import { IMemberPhotoList } from 'common/features/evaluation-member/lib';

export const MemberPhotosListContent: FC<IMemberPhotoList> = ({
  photos,
  beforeAfter,
}) => {
  useEffect(() => {
    Fancybox.bind('[data-fancybox]', {
      Toolbar: false,
      Images: {
        zoom: false,
      },
    });
  }, []);

  return (
    <ul className={styles.member_photos__list}>
      {photos
        .filter((photo) => photo.before_after === beforeAfter)
        .map((photo) => (
          <li key={photo.id} className={styles.member_photos__item}>
            <a
              data-fancybox
              data-src={photo.photo}
              href={photo.photo as string}
              className={styles.member_photos__link}
            >
              <img
                className={styles.member_photos__img}
                src={photo.optimized_photo || photo.photo as string}
                width={100}
                height={100}
                alt={photo.name}
              />
            </a>
            <span className={styles.member_photos__name}>{photo.name}</span>
          </li>
        ))}
    </ul>
  );
};
