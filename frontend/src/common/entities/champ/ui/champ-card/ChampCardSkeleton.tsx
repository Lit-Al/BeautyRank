import React from 'react';
import styles from './ChampCard.module.scss';
import Skeleton from 'react-loading-skeleton';

export const ChampCardSkeleton = () => (
  <Skeleton
    width={280}
    height={90}
    baseColor="#d3d3d3"
    highlightColor="#e6e6e6"
    className={styles.champs__btn_skeleton}
  />
);
