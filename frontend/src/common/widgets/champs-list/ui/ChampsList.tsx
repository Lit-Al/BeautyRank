import { ChampCard, ChampCardSkeleton } from 'common/entities/champ';
import { getChamps } from 'common/shared/api/champs';
import { useQuery } from 'react-query';
import styles from './Champs-list.module.scss';
import { AnimatePresence, motion } from 'framer-motion';

export const ChampsList = ({ disableChamps }: { disableChamps: boolean }) => {
  const { data: champsData, isLoading } = useQuery('champs', getChamps);

  if (isLoading) {
    return (
      <AnimatePresence>
        <div className={styles.champs__list}>
          <ChampCardSkeleton />
        </div>
      </AnimatePresence>
    );
  }

  return (
    <ul className={styles.champs__list}>
      {champsData?.data?.map((champ, index) => {
        return (
          <>
            <motion.li
              key={champ.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ChampCard disableChamp={disableChamps} champ={champ} />
            </motion.li>
          </>
        );
      })}
    </ul>
  );
};

export default ChampsList;
