import { useEffect, useMemo, useState } from 'react';
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
import { motion } from 'framer-motion';

export const EvaluationModal = () => {
  const router = useRouter();
  const { evaluation, score } = router.query;
  const { member, memberPhotos } = useMember(Number(evaluation!));
  const { data: master } = useQuery(
    'master',
    () => getUser(member?.id_member!),
    {
      enabled: !!member?.id_member,
    }
  );

  const whatsappLink = useMemo(() => {
    if (!master || !member) return '';
    return `https://api.whatsapp.com/send/?phone=${master?.data.phone_number}&text=Добрый день, ${master?.data.first_name}! Я оценил(а) вашу работу в номинации - ${member?.nomination} ${member?.category}!`;
  }, [master, member]);

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(!!evaluation);

  useEffect(() => {
    Fancybox.bind('[data-fancybox]', {
      Toolbar: false,
      Images: { zoom: false },
    });
  }, []);

  const handleCloseModal = () => {
    router.replace(router.pathname, undefined, { shallow: true });
    setEvaluationModalOpen(false);
  };

  const modalVariants = {
    hidden: { y: '-100%', opacity: 0, transition: { duration: .8 } },
    visible: { y: '0%', opacity: 1, transition: { duration: .8 } },
  };

  return (
    <div>
      {evaluationModalOpen && (
        <>
          <div onClick={handleCloseModal} className={styles.blur}></div>
          <motion.div
            className={styles.evaluation__modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <button
              onClick={handleCloseModal}
              className={styles.evaluation__close}
            >
              <Image src={CloseIcon} alt="Close" />
            </button>
            <p className={styles.evaluation__modal_separation}>Успешно!</p>
            <ul className={styles.evaluation__list}>
              {memberPhotos
                ?.filter((memberData) => memberData.before_after === 'AF')
                .map((memberData) => (
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
                        quality={75}
                      />
                    </a>
                    <span className={styles.evaluation__name}>
                      {memberData.name}
                    </span>
                  </li>
                ))}
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
          </motion.div>
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
