import React from 'react';
import styles from './MemberCard.module.scss';
import Skeleton from 'react-loading-skeleton';
import cn from 'classnames';

export const MemberCardSkeleton = () => (
  <Skeleton
    height={65}
    baseColor="#d3d3d3"
    highlightColor="#e6e6e6"
    className={cn(styles.members__item, styles.members__item_skeleton)}
  />
);
