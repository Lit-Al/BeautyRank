import styles from './Avatar.module.scss';
import { BASE_URL } from 'common/shared/api/endpoints';
import { isBase64Image } from 'common/shared/helpers';
import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { userAtom } from 'store';

interface IAvatarProps {
  edit?: boolean;
}

const Avatar = ({ edit = false }: IAvatarProps) => {
  const user = useAtomValue(userAtom);
  const isBase64 = isBase64Image(user?.image);
  const avatarUrl = isBase64 ? user?.image : `${BASE_URL}${user?.image}`;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className={`${edit ? styles.user_avatar_edit : ''}`}>
          <img
            src={avatarUrl ? avatarUrl : ''}
            className={`${styles.user_avatar} `}
            alt={`${user?.first_name} ${user?.last_name}`}
            width={112}
            height={112}
          />
        </div>
      )}
    </>
  );
};

export default Avatar;
