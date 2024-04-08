import styles from './ChampCard.module.scss';
import Image from 'next/image';
import { ChampCardProps } from '../../lib';
import { useAtom } from 'jotai';
import { champAtom } from 'store';
import { useRouter } from 'next/router';
import { USER_IS_UNKNOWN } from 'common/shared/constants';

export const ChampCard = ({ champ, disableChamp }: ChampCardProps) => {
  const [selectedChamp, setSelectedChamp] = useAtom(champAtom);
  const router = useRouter();

  const isButtonDisabled = champ.role === USER_IS_UNKNOWN || disableChamp;

  return (
    <li className={styles.champs__item}>
      <button
        disabled={isButtonDisabled}
        type="button"
        className={`${styles.champs__btn} ${
          selectedChamp?.id === champ.id && styles.champs__btn_active
        }`}
        onClick={() => {
          setSelectedChamp(champ);
          router.push('./profile');
        }}
      >
        <Image width={280} height={90} src={champ?.image} alt={champ.name} />
      </button>
    </li>
  );
};

export default ChampCard;
