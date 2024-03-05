import { Button } from 'common/shared/ui/button';
import React from 'react';
import uploadPhtotoBackg from '@/public/images/background-eyebrows.jpg';
import styles from './UploadPhotoForm.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UploadPhotoBox from '../UploadPhotoBox/UploadPhotoBox';
import {
  useUploadPhotos,
  useImageSrc,
  useFileChange,
  useModel,
} from 'common/features/upload-model-photo/model';

const UploadPhotoForm = () => {
  const router = useRouter();
  const modelId = Number(router.query.modelId);
  const { model, selectedFiles, setSelectedFiles } = useModel(modelId);
  const { handleFileChange } = useFileChange({
    model,
    modelId,
    selectedFiles,
    setSelectedFiles,
  });
  const { getImageSrc } = useImageSrc({ selectedFiles });
  const { mutation } = useUploadPhotos({ selectedFiles });

  const buttonIsDisabled = () => {
    if (selectedFiles.length) {
      return selectedFiles.some((file) => file === null);
    }
    return true;
  };

  return (
    <>
      <Image src={uploadPhtotoBackg} alt="Выберите Фото" width={362} />
      <h3 className={styles.upload_photo__title}>Загрузите фото модели</h3>
      <p className={styles.upload_photo__nomination}>
        {model?.nomination} {model?.category}
      </p>
      <form className={styles.upload_photo__form}>
        <UploadPhotoBox
          title="ДО"
          photos={model?.nomination_info.after || []}
          onChange={handleFileChange}
          getImageSrc={getImageSrc}
        />
        <UploadPhotoBox
          title="ПОСЛЕ"
          photos={model?.nomination_info.before || []}
          onChange={(index) =>
            handleFileChange(index + (model?.nomination_info.after.length || 0))
          }
          getImageSrc={(index) =>
            getImageSrc(index + (model?.nomination_info.after.length || 0))
          }
        />
      </form>
      <Button
        disabled={buttonIsDisabled()}
        className={styles.upload_photo__btn}
        onClick={() => mutation.mutate()}
      >
        Подтвердить
      </Button>
    </>
  );
};

export default UploadPhotoForm;
