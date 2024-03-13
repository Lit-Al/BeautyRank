import React from 'react';
import styles from './EvaluationModal.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'common/shared/ui/button';
import { IEvaluationModalProps } from '../../lib';
import CloseIcon from '@/public/images/close-icon.svg';
import WhatsAppIcon from '@/public/images/whatsapp-icon.svg';
import { useSetMemberResult } from '../../model';

const EvaluationModal = ({
  isModalOpen,
  memberPhotos,
  setModalOpen,
  member,
  totalScore,
  memberAttributes,
  isAllAttributesFilled,
}: IEvaluationModalProps) => {
  const { mutateAsync: postResult } = useSetMemberResult({
    memberId: member?.id,
    totalScore,
    memberAttributes,
  });

  return (
    <div>
      {isModalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            className={styles.blur}
          ></div>
          <div className={styles.evaluation__modal}>
            <button
              className={styles.evaluation__close}
              onClick={() => setModalOpen(false)}
            >
              <Image src={CloseIcon} alt="Close" />
            </button>
            <p className={styles.evaluation__modal_separation}>ПОСЛЕ</p>
            <ul className={styles.evaluation__list}>
              {memberPhotos?.map((memberData) => {
                if (memberData.before_after === 'AF') {
                  return (
                    <li key={memberData.id} className={styles.evaluation__item}>
                      <Image
                        className={styles.evaluation__img}
                        src={memberData.photo as string}
                        width={75}
                        height={75}
                        alt={memberData.name}
                      />
                      <span className={styles.evaluation__name}>
                        {memberData.name}
                      </span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <h3 className={styles.evaluation__category}>
              {member?.nomination} {member?.category}
            </h3>
            <p className={styles.evaluation__total}>
              Сумма баллов: <span>{totalScore}</span>
            </p>
            <p className={styles.evaluation__comment}>
              Дать комментарий
              <Link href="#">
                <Image width={22} src={WhatsAppIcon} alt="WhatsApp" />
              </Link>
            </p>
            <Button
              disabled={!isAllAttributesFilled}
              className={styles.evaluation__modal_btn}
              onClick={() => postResult()}
            >
              Подтвердить
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluationModal;
