import {
  getChampWinnersCategories,
  getChampWinnersNominations,
} from 'common/shared/api/champs';
import { Layout } from 'common/shared/ui/layout';
import { useAtomValue } from 'jotai';
import router from 'next/router';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { champAtom } from 'store';
import styles from './ChampResultPage.module.scss';
import { declineNumberOfBalls } from 'common/shared/helpers';
import { Loader } from 'common/shared/ui/loader';
import { getUserIsOrganizer } from 'common/shared/constants';

function ChampResultPage() {
  const champ = useAtomValue(champAtom);
  const [isClient, setIsClient] = useState(false);
  const USER_IS_ORGANIZER = getUserIsOrganizer();

  useEffect(() => {
    setIsClient(true);
    if (!USER_IS_ORGANIZER) {
      router.replace('/profile-edit');
    }
  }, [USER_IS_ORGANIZER]);

  const { data: champWinnersNominationsData, isLoading: isNominationsLoading } =
    useQuery(
      ['champWinnersNominations', champ?.id],
      () => getChampWinnersNominations(champ?.id!),
      {
        enabled: !!champ,
      }
    );
  const { data: champWinnersCategoriesData, isLoading: isCategoriesLoading } =
    useQuery(
      ['champWinnersCategories', champ?.id],
      () => getChampWinnersCategories(champ?.id!),
      {
        enabled: !!champ,
      }
    );

  const champWinnersCategories = champWinnersCategoriesData?.data;
  const champWinnersNominations = champWinnersNominationsData?.data;
  const isLoading = isNominationsLoading || isCategoriesLoading;

  return (
    <Layout pageTitle={'Результаты чемпионата'}>
      {!isLoading && isClient ? (
        <>
          <ul className={styles.nominations_categories__list}>
            <li className={styles.nominations_categories__item}>
              <h1 className={styles.nominations_categories__title}>
                Победители Номинаций
              </h1>
              {champWinnersNominations?.map((nomination, index) => (
                <div key={index}>
                  <h2 className={styles.nominations_categories__nomination}>
                    {nomination.name}
                  </h2>
                  {nomination.members.map((member, index) => (
                    <div key={index}>
                      <h3
                        className={styles.nominations_categories__member_name}
                      >
                        {member.member}
                      </h3>
                      <h3 className={styles.nominations_categories__result}>
                        Результат: {member.result_all}{' '}
                        {declineNumberOfBalls(member.result_all)}
                      </h3>
                    </div>
                  ))}
                </div>
              ))}
            </li>
            <li className={styles.nominations_categories__item}>
              <h1 className={styles.nominations_categories__title}>
                Победители Категорий
              </h1>
              {champWinnersCategories?.map((nomination, index) => (
                <div key={index}>
                  <h2 className={styles.nominations_categories__nomination}>
                    {nomination.name}
                  </h2>
                  {nomination.members.map((member, index) => (
                    <div key={index}>
                      <h3
                        className={styles.nominations_categories__member_name}
                      >
                        {member.member}
                      </h3>
                      <h3 className={styles.nominations_categories__result}>
                        Результат: {member.result_all}{' '}
                        {declineNumberOfBalls(member.result_all)}
                      </h3>
                    </div>
                  ))}
                </div>
              ))}
            </li>
          </ul>
        </>
      ) : (
        <Loader fullPage />
      )}
    </Layout>
  );
}

export default ChampResultPage;
