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
          {Array.from({ length: 2 }, (_, index) => (
            <ChampCardSkeleton key={index} />
          ))}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <ul className={styles.champs__list}>
      {champsData?.data?.map((champ, index) => {
        return (
          <>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ChampCard
                disableChamp={disableChamps}
                champ={champ}
                key={champ.id}
              />
            </motion.div>
          </>
        );
      })}
    </ul>
  );
};

export default ChampsList;
