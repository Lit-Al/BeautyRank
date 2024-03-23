import styles from './Avatar.module.scss';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BASE_API_URL } from 'common/shared/api/endpoints';
import { IUser } from 'common/shared/types';

interface IAvatarProps {
  edit?: boolean;
  user: IUser;
}

const Avatar = ({ edit = false, user }: IAvatarProps) => {
  const [isClient, setIsClient] = useState(false);
  const image = user?.image;
  const imageFile = image instanceof File && URL.createObjectURL(image);

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
          {(!!imageFile || typeof image === 'string') && (
            <Image
              src={
                imageFile
                  ? URL.createObjectURL(user.image as File)
                  : `${BASE_API_URL}${image}`
              }
              className={`${styles.user_avatar} `}
              alt={`${user?.first_name} ${user?.last_name}`}
              width={150}
              height={150}
              quality={100}
              layout="responsive"
              priority
            />
          )}
        </div>
      )}
    </>
  );
};

export default Avatar;

// URL.createObjectURL(user?.image!)
