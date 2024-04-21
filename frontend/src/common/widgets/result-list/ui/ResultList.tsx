import { getMemberResults } from 'common/shared/api/assessments';
import { getMemberPhotos, getMember } from 'common/shared/api/members';
import { Loader } from 'common/shared/ui/loader';
import { MemberPhotosList } from 'common/widgets/member-photos-list';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styles from './ResultList.module.scss';
import { IResult } from 'common/features/evaluation-member/lib';
import { BeautyLoader } from 'common/shared/ui/beauty-loader';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from '@/public/images/whatsapp-icon.svg';
import { getUser } from 'common/shared/api/users';
import { IUser } from 'common/shared/types';
import { IMember } from 'common/entities/member';
import { getUserIsStaff } from 'common/shared/constants';

export const ResultList = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);
  const [master, setMaster] = useState<IUser>();
  const [member, setMember] = useState<IMember>();
  const USER_IS_STAFF = getUserIsStaff();

  const { data: resultData, isLoading: resultDataDataIsLoading } = useQuery(
    'memberResult',
    () => getMemberResults(memberId),
    {
      enabled: !!memberId,
      refetchOnWindowFocus: true,
      //запрос раз в 5 минут
      refetchInterval: 50 * 60 * 100,
    }
  );

  const { data: memberPhotosData, isLoading: memberPhotosDataIsLoading } =
    useQuery('memberPhotos', () => getMemberPhotos(memberId), {
      enabled: !!memberId,
    });

  const { data: memberData, isLoading: memberDataIsLoading } = useQuery(
    ['member', memberId],
    () => getMember(memberId),
    {
      enabled: !!memberId,
      onSuccess: (data) => setMember(data.data),
    }
  );

  const criteries = useMemo(() => {
    return resultData?.data[0]?.score_retail
      ? Object.keys(resultData.data[0].score_retail)
      : [];
  }, [resultData]);

  useQuery('master', () => getUser(memberData?.data.id_member!), {
    enabled: USER_IS_STAFF && !!memberData?.data.id_member,
    onSuccess: (data) => setMaster(data.data),
  });

  const whatsappLink = useMemo(() => {
    if (!master || !memberData) return '';
    return `https://api.whatsapp.com/send/?phone=${master.phone_number}&text=Добрый день, ${master.first_name}! Я оценил(а) вашу работу в номинации - ${memberData.data.nomination} ${memberData.data.category}!`;
  }, [master, memberData]);

  if (
    resultDataDataIsLoading ||
    memberPhotosDataIsLoading ||
    memberDataIsLoading
  ) {
    return <Loader />;
  }

  return (
    <>
      <MemberPhotosList memberPhotos={memberPhotosData?.data} />
      <p className={styles.member__nomination}>
        {`${member?.nomination || ''} ${member?.category || ''}`}
      </p>
      {!!resultData?.data.length ? (
        <>
          <div className={styles.result__box}>
            <ul className={styles.result__list}>
              {criteries.map((criteria, index, criteries) => (
                <li key={index} className={styles.result__item}>
                  <p className={styles.result__criteria}>{criteria}</p>
                  <p className={styles.result__score}>
                    {resultData?.data.map(
                      (item: IResult, itemIndex: number) => (
                        <div key={itemIndex}>
                          <span>{item.score_retail![criteria]}</span>
                          {index === criteries.length - 1 && (
                            <p className={styles.result__staff}>
                              {item.event_staff_name}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </p>
                  {index === criteries.length - 1 && (
                    <>
                      {!USER_IS_STAFF && (
                        <p className={styles.result__comment}>
                          Дать комментарий
                          <Link target="_blank" href={whatsappLink}>
                            <Image
                              width={22}
                              src={WhatsAppIcon}
                              alt="WhatsApp"
                            />
                          </Link>
                        </p>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <BeautyLoader />
      )}
    </>
  );
};
