import React, { useEffect } from 'react';
import styles from './EvaluationModal.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { IEvaluationModalProps } from '../../lib';
import CloseIcon from '@/public/images/close-icon.svg';
import WhatsAppIcon from '@/public/images/whatsapp-icon.svg';
import { getUser } from 'common/shared/api/users';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Fancybox } from '@fancyapps/ui';

export const EvaluationModal = ({
  isModalOpen,
  memberPhotos,
  setModalOpen,
  member,
  totalScore,
  nomination,
}: IEvaluationModalProps) => {
  const { data: master } = useQuery('master', () => getUser(member?.id), {
    enabled: !!member?.id, // включить запрос только если member.id существует
  });
  const router = useRouter();
  const whatsappLink = `https://api.whatsapp.com/send/?phone=${master?.data.phone_number}&text=Добрый день, ${master?.data.first_name}! Я оценил(а) вашу работу в номинации - ${nomination}!`;

  useEffect(() => {
    Fancybox.bind('[data-fancybox]', {
      Toolbar: false,
      Images: {
        zoom: false,
      },
    });
  }, []);

  return (
    <div>
      {isModalOpen && (
        <>
          <div
            onClick={() => {
              router.replace(router.pathname, undefined, { shallow: true });
              setModalOpen(false);
            }}
            className={styles.blur}
          ></div>
          <div className={styles.evaluation__modal}>
            <button
              className={styles.evaluation__close}
              onClick={() => {
                router.replace(router.pathname, undefined, { shallow: true });
                setModalOpen(false);
              }}
            >
              <Image src={CloseIcon} alt="Close" />
            </button>
            <p className={styles.evaluation__modal_separation}>Успешно!</p>
            <ul className={styles.evaluation__list}>
              {memberPhotos?.map((memberData) => {
                if (memberData.before_after === 'AF') {
                  return (
                    <li key={memberData.id} className={styles.evaluation__item}>
                      <a
                        data-fancybox
                        data-src={memberData.photo}
                        href={memberData.photo as string}
                        className={styles.member_photos__link}
                      >
                        <Image
                          className={styles.evaluation__img}
                          src={memberData.photo as string}
                          width={75}
                          height={75}
                          alt={memberData.name}
                        />
                      </a>

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
              <Link target="_blank" href={whatsappLink}>
                <Image width={22} src={WhatsAppIcon} alt="WhatsApp" />
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
