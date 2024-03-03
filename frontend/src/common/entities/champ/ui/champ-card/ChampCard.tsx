import React from 'react';
import styles from './ChampCard.module.scss';
import Image from 'next/image';
import logo from '@/public/images/logo.svg';
import { ChampCardProps } from '../../lib';
import { useAtom } from 'jotai';
import { champAtom } from 'store';

export const ChampCard = ({ champ }: ChampCardProps) => {
  const [selectedChamp, setSelectedChamp] = useAtom(champAtom);

  return (
    <li className={styles.champs__item}>
      <button
        type="button"
        className={`${styles.champs__btn} ${
          selectedChamp?.id === champ.id && styles.champs__btn_active
        }`}
        onClick={() => setSelectedChamp(champ)}
      >
        <Image width={280} height={90} src={logo} alt={champ.name} />
      </button>
    </li>
  );
};

export default ChampCard;
