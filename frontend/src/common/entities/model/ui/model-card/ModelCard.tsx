import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ModelCard.module.scss';
import unknownAvatar from '@/public/images/unknown-avatar.svg';
import { declineNumberOfBalls } from 'common/shared/helpers';
import { ModelCardProps } from 'common/entities/model/lib';
import { BASE_URL } from 'common/shared/api/endpoints';

export const ModelItem: React.FC<ModelCardProps> = ({ model }) => {
  console.log(model.preview);

  return (
    <li className={styles.models__item} key={model.id}>
      <Link
        href={`/upload-photo/${model.id}`}
        className={styles.models__content}
      >
        <span className={styles.models__number}>№{model.id}</span>
        <div className={styles.models__service}>
          <p className={styles.models__nomination}>
            {`${model.nomination} ${model.category}`}
          </p>
          <span className={styles.models__points}>
            {model.result_sum} {declineNumberOfBalls(model.result_sum)}
          </span>
        </div>
        <Image
          width={55}
          height={55}
          className={styles.models__avatar}
          src={`${BASE_URL}${model.preview}` || unknownAvatar}
          alt={`${model.nomination} ${model.category}`}
        />
      </Link>
    </li>
  );
};
