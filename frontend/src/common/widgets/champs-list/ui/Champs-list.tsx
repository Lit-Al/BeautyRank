import { ChampCard, IChamp } from 'common/entities/champ';
import { getChamps } from 'common/shared/api/champs';
import React from 'react';
import { useQuery } from 'react-query';
import styles from './Champs-list.module.scss';
import { Loader } from 'common/shared/ui/loader';

export const ChampsList = () => {
  const { data: champsData, isLoading } = useQuery('champs', getChamps);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className={styles.champs__list}>
      {champsData?.data?.map((champ) => {
        return <ChampCard champ={champ} key={champ.id} />;
      })}
    </ul>
  );
};

export default ChampsList;
