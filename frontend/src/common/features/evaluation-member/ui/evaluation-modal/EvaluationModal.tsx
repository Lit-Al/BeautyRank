import React, { useEffect, useState } from 'react';
import styles from './EvaluationModal.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import CloseIcon from '@/public/images/close-icon.svg';
import WhatsAppIcon from '@/public/images/whatsapp-icon.svg';
import { getUser } from 'common/shared/api/users';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Fancybox } from '@fancyapps/ui';
import Confetti from 'react-confetti';
import { useMember } from '../../model/useEvaluationMember';

export const EvaluationModal = () => {
  const router = useRouter();
  const { query } = router;
  const { evaluation } = query;
  const { score } = query;
  const { member, memberPhotos, memberAttributes } = useMember(
    Number(evaluation!)
  );
  const { data: master } = useQuery('master', () => getUser(member?.id!), {
    enabled: !!member?.id,
  });
  const whatsappLink = `https://api.whatsapp.com/send/?phone=${master?.data.phone_number}&text=Добрый день, ${master?.data.last_name}! Я оценил(а) вашу работу в номинации - ${member?.nomination} ${member?.category}!`;

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);

  useEffect(() => {
    setEvaluationModalOpen(!!evaluation);
  }, [evaluation]);

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
      {evaluationModalOpen && (
        <>
          <div
            onClick={() => {
              router.replace(router.pathname, undefined, { shallow: true });
              setEvaluationModalOpen(false);
            }}
            className={styles.blur}
          ></div>
          <div className={styles.evaluation__modal}>
            <button
              className={styles.evaluation__close}
              onClick={() => {
                router.replace(router.pathname, undefined, { shallow: true });
                setEvaluationModalOpen(false);
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
              })}
            </ul>
            <h3 className={styles.evaluation__category}>
              {member?.nomination} {member?.category}
            </h3>
            <p className={styles.evaluation__total}>
              Сумма баллов: <span>{score}</span>
            </p>
            <p className={styles.evaluation__comment}>
              Дать комментарий
              <Link target="_blank" href={whatsappLink}>
                <Image width={22} src={WhatsAppIcon} alt="WhatsApp" />
              </Link>
            </p>
          </div>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            tweenDuration={1000}
            wind={0.04}
            colors={[
              '#ffb6c1',
              '#ff80ab',
              '#ff4081',
              '#f50057',
              '#c51162',
              '#FF3E9B',
            ]}
          />
        </>
      )}
    </div>
  );
};
