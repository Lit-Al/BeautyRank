import React from 'react';
import styles from './ChampCard.module.scss';
import Image from 'next/image';
import { ChampCardProps } from '../../lib';
import { useAtom } from 'jotai';
import { champAtom } from 'store';

export const ChampCard = ({ champ }: ChampCardProps) => {
  const [selectedChamp, setSelectedChamp] = useAtom(champAtom);
  const notMember = champ?.role === 'Unknown role';

  return (
    <li className={styles.champs__item}>
      <button
        disabled={champ?.role === 'Unknown role'}
        type="button"
        className={`${styles.champs__btn} ${
          selectedChamp?.id === champ.id && styles.champs__btn_active
        }`}
        onClick={() => setSelectedChamp(champ)}
      >
        <Image width={280} height={90} src={champ?.image} alt={champ.name} />
      </button>
      <p className={styles.champs__not_member}>
        {notMember && 'На данный момент вы не являетесь участником('}
      </p>
    </li>
  );
};

export default ChampCard;
