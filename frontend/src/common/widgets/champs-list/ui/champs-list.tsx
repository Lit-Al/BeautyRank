import { ChampCard, IChamp } from 'common/entities/champ';
import { getChamps } from 'common/shared/api/champs';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import styles from './champs-list.module.scss';

export const ChampsList = () => {
  const [champs, setChamps] = useState<IChamp[]>();

  const getChampsMutation = useMutation(async () => {
    try {
      const { data } = await getChamps();
      console.log(data);

      setChamps(data);
      return data;
    } catch (error) {
      // Обработка ошибки
      console.log(error);
      throw error;
    }
  });

  useEffect(() => {
    getChampsMutation.mutateAsync();
  }, []);

  return (
    <ul className={styles.champs__list}>
      {champs?.map((champ) => {
        return <ChampCard champ={champ} key={champ.id} />;
      })}
    </ul>
  );
};

export default ChampsList;
