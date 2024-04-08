import React from 'react';
import styles from './MemberCard.module.scss';
import Skeleton from 'react-loading-skeleton';

export const MemberCardSkeleton = () => (
  <Skeleton
    width={338}
    height={75}
    baseColor="#d3d3d3"
    highlightColor="#e6e6e6"
    className={styles.members__item_skeleton}
  />
);
