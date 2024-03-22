import styles from './Avatar.module.scss';
import { BASE_API_URL } from 'common/shared/api/endpoints';
import { isBase64Image } from 'common/shared/helpers';
import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { avatarAtom, userAtom } from 'store';
import Image from 'next/image';

interface IAvatarProps {
  edit?: boolean;
}

const Avatar = ({ edit = false }: IAvatarProps) => {
  const user = useAtomValue(userAtom);
  const avatar = useAtomValue(avatarAtom);
  const isBase64 = isBase64Image(user?.image);
  const avatarUrl = avatar
    ? avatar.image
    : isBase64
    ? user?.image
    : `${BASE_API_URL}${user?.image}`;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div
          className={`${edit ? styles.user_avatar_edit : ''} ${
            styles.user_avatar_box
          }`}
        >
          <Image
            src={avatarUrl ? avatarUrl : ''}
            className={`${styles.user_avatar} `}
            alt={`${user?.first_name} ${user?.last_name}`}
            width={150}
            height={150}
            quality={100}
            layout="responsive"
            priority
          />
        </div>
      )}
    </>
  );
};

export default Avatar;
