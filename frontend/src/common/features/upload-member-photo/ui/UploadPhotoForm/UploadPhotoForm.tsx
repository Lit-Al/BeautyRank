import { Button } from 'common/shared/ui/button';
import React from 'react';
import uploadPhtotoBackg from '@public/images/background-eyebrows.jpg';
import styles from './UploadPhotoForm.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UploadPhotoBox from '../UploadPhotoBox/UploadPhotoBox';
import {
  useUploadPhotos,
  useMemberImageSrc,
  useFileChange,
  useMember,
} from 'common/features/upload-member-photo/model';
import { Loader } from 'common/shared/ui/loader';
import Link from 'next/link';
import { BEAUTY_RANK_BOT } from 'common/shared/api/endpoints';

const UploadPhotoForm = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);

  const { member, selectedFiles, setSelectedFiles } = useMember(memberId);
  const { handleFileChange } = useFileChange({
    member,
    memberId,
    selectedFiles,
    setSelectedFiles,
  });
  const { getImageSrc } = useMemberImageSrc({ selectedFiles });
  const { mutation } = useUploadPhotos({ selectedFiles });

  const buttonIsDisabled = () => {
    if (selectedFiles.length) {
      return selectedFiles.some((file) => file === null);
    }
    return true;
  };

  return (
    <>
      {member ? (
        <>
          <div className={styles.upload_photo__backg}>
            <Image
              src={uploadPhtotoBackg}
              alt="Выберите Фото"
              layout="responsive"
            />
          </div>

          <h3 className={styles.upload_photo__title}>Загрузите фото модели</h3>
          <p className={styles.upload_photo__nomination}>
            {member?.nomination} {member?.category}
          </p>
          <form className={styles.upload_photo__form}>
            <UploadPhotoBox
              title="ДО"
              photos={member?.nomination_info.after || []}
              onChange={handleFileChange}
              getImageSrc={getImageSrc}
            />
            <UploadPhotoBox
              title="ПОСЛЕ"
              photos={member?.nomination_info.before || []}
              onChange={(index) =>
                handleFileChange(
                  index + (member?.nomination_info.after.length || 0)
                )
              }
              getImageSrc={(index) =>
                getImageSrc(index + (member?.nomination_info.after.length || 0))
              }
            />
          </form>
          <Link
            href={`${BEAUTY_RANK_BOT} ${memberId}`}
            className={styles.upload_photo__video_link}
          >
            Загрузить Видео
          </Link>
          <Button
            disabled={buttonIsDisabled()}
            className={styles.upload_photo__btn}
            onClick={() => mutation.mutate()}
          >
            Подтвердить
          </Button>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UploadPhotoForm;
