import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ModelCard.module.scss';
import unknownAvatar from '@/public/images/unknown-avatar.svg';
import { declineNumberOfBalls } from 'common/shared/helpers';
import { ModelCardProps } from 'common/entities/model/lib';
import { BASE_URL } from 'common/shared/api/endpoints';
import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const user = useAtomValue(userAtom);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ.role === 'Судья';
  const modelCurrent = model.member.includes(user?.last_name!);
  const modelPreview = model.preview
    ? `${BASE_URL}${model.preview}`
    : unknownAvatar;

  const modelLink = () => {
    if (modelCurrent && !model.preview) {
      return `/upload-photo/${model.id}`;
    }
    if (userIsStaff && model.preview) {
      return `/model-evaluation/${model.id}`;
    } else {
      return '#';
    }
  };

  // modelCurrent && !model.preview ? `/upload-photo/${model.id}` : '#';

  return (
    <li className={styles.models__item} key={model.id}>
      <Link
        href={modelLink()}
        className={`${styles.models__content} ${
          !modelCurrent && !userIsStaff && styles.models__content_other
        } ${model.result_sum > 0 && styles.models__content_done}`}
      >
        <span className={styles.models__number}>№{model.id}</span>
        <div className={styles.models__service}>
          <p className={styles.models__nomination}>
            {`${model.nomination} ${model.category}`}
          </p>
          <span className={styles.models__points}>
            {!model.preview || userIsStaff || !modelCurrent ? (
              <>
                {model.result_sum} {declineNumberOfBalls(model.result_sum)}
              </>
            ) : (
              'оценивается'
            )}
          </span>
        </div>
        <Image
          width={55}
          height={55}
          className={styles.models__avatar}
          src={modelPreview}
          alt={`${(model.nomination, model.category)}`}
        />
      </Link>
    </li>
  );
};
