import styles from './Avatar.module.scss';
import Image from 'next/image';
import { BASE_API_URL } from 'common/shared/api/endpoints';
import { IUser } from 'common/shared/types';
import cn from 'classnames';

interface IAvatarProps {
  edit?: boolean;
  user: IUser;
}

const Avatar = ({ edit = false, user }: IAvatarProps) => {
  const avatarSrc = user?.image
    ? user.image instanceof File
      ? URL.createObjectURL(user.image)
      : `${BASE_API_URL}${user.image}`
    : null;

  return (
    <>
      <div
        className={cn(
          { [styles.user_avatar_edit]: edit },
          styles.user_avatar_box
        )}
      >
        {avatarSrc && (
          <Image
            src={avatarSrc}
            className={styles.user_avatar}
            alt={`${user?.first_name} ${user?.last_name}`}
            width={150}
            height={150}
            layout="responsive"
            priority
            quality={75}
          />
        )}
      </div>
    </>
  );
};

export default Avatar;
