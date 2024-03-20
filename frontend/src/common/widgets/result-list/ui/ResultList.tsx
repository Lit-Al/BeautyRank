import { getMemberResults } from 'common/shared/api/assessments';
import { getMemberPhotos, getMember } from 'common/shared/api/members';
import { Loader } from 'common/shared/ui/loader';
import { MemberPhotosList } from 'common/widgets/member-photos-list';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import styles from './ResultList.module.scss';
import { IResult } from 'common/features/evaluation-member/lib';
import { BeautyLoader } from 'common/shared/ui/beauty-loader';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from '@/public/images/whatsapp-icon.svg';
import { getUser } from 'common/shared/api/users';
import { useAtomValue } from 'jotai';
import { champAtom } from 'store';

export const ResultList = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);
  const champ = useAtomValue(champAtom);

  const { data: resultData } = useQuery(
    'memberResult',
    () => getMemberResults(memberId),
    {
      enabled: !!memberId,
      refetchOnWindowFocus: true,
      //запрос раз в 5 минут
      refetchInterval: 50 * 60 * 100,
    }
  );

  const { data: memberPhotosData } = useQuery(
    'memberPhotos',
    () => getMemberPhotos(memberId),
    {
      enabled: !!memberId,
    }
  );

  const { data: memberData } = useQuery(
    ['member', memberId],
    () => getMember(memberId),
    {
      enabled: !!memberId,
    }
  );

  const criteries = useMemo(() => {
    return resultData?.data[0]?.score_retail
      ? Object.keys(resultData.data[0].score_retail)
      : [];
  }, [resultData]);

  const { data: master } = useQuery(
    'master',
    () => getUser(memberData?.data.id_member!),
    {
      enabled: !!memberData?.data.id_member,
    }
  );

  const whatsappLink = `https://api.whatsapp.com/send/?phone=${master?.data.phone_number}&text=Добрый день, ${master?.data.first_name}! Я оценил(а) вашу работу в номинации - ${memberData?.data.nomination} ${memberData?.data.category}!`;

  if (!memberPhotosData || !memberData || !resultData) {
    return <Loader />;
  }
  return (
    <>
      <MemberPhotosList memberPhotos={memberPhotosData.data || []} />
      <p className={styles.member__nomination}>
        {`${memberData.data.nomination} ${memberData.data.category}`}
      </p>
      {resultData.data.length > 0 ? (
        <>
          <ul className={styles.result__list}>
            {criteries.map((criteria, index) => (
              <li key={index} className={styles.result__item}>
                <p className={styles.result__criteria}>{criteria}</p>
                <p className={styles.result__score}>
                  {resultData?.data.map((item: IResult, itemIndex: number) => (
                    <div key={itemIndex}>
                      <span>{item.score_retail![criteria]}</span>
                      {index === criteries.length - 1 && (
                        <p className={styles.result__staff}>
                          {item.event_staff_name}
                        </p>
                      )}
                    </div>
                  ))}
                </p>
              </li>
            ))}
            {champ?.role === 'Судья' && (
              <p className={styles.result__comment}>
                Дать комментарий
                <Link target="_blank" href={whatsappLink}>
                  <Image width={22} src={WhatsAppIcon} alt="WhatsApp" />
                </Link>
              </p>
            )}
          </ul>
        </>
      ) : (
        <BeautyLoader />
      )}
    </>
  );
};
