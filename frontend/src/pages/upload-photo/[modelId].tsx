import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './upload-photo.module.scss';
import { Layout } from 'common/shared/ui/layout';
import uploadPhtotoBackg from '@/public/images/background-eyebrows.jpg';
import Image from 'next/image';
import { Button } from 'common/shared/ui/button';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { IModel } from 'common/entities/model';
import { getModel, setModelPhotos } from 'common/shared/api/models';
import { useMutation } from 'react-query';
import unknownAvatar from '@/public/images/unknown-avatar.svg';

export interface IPhoto {
  member_nomination: number;
  photo: File;
  before_after: 'BE' | 'AF';
  name: string;
}

const UploadPhotoPage = () => {
  const router = useRouter();
  const modelId = Number(router.query.modelId);
  const [model, setModel] = useState<IModel>();
  const [selectedFiles, setSelectedFiles] = useState<IPhoto[]>([]);
  console.log(selectedFiles);

  const buttonIsDisabled = () => {
    if (selectedFiles.length) {
      return selectedFiles.some((file) => file === null);
    }
    return true;
  };

  const getModelsList = useMutation(async () => {
    try {
      if (modelId) {
        const { data } = await getModel(modelId);
        setModel(data);
        setSelectedFiles(
          Array(
            data.nomination_info.after.length +
              data.nomination_info.before.length
          ).fill(null)
        );
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getModelsList.mutateAsync();
  }, [modelId]);

  const handleFileChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      const isAfter = index < model?.nomination_info.after.length!;
      const name = isAfter
        ? model?.nomination_info.after[index].name
        : model?.nomination_info.before[
            index - model?.nomination_info.after.length
          ].name;
      const beforeAfter = isAfter ? 'BE' : 'AF';

      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.map((selectedFile, i) =>
          i === index
            ? {
                member_nomination: modelId,
                photo: file!,
                before_after: beforeAfter,
                name: name!,
              }
            : selectedFile
        )
      );
    };

  const getImageSrc = (index: number) => {
    const selectedFile = selectedFiles[index];
    if (selectedFile && selectedFile.photo) {
      return URL.createObjectURL(selectedFile.photo);
    }
    return unknownAvatar;
  };

  const uploadPhotos = async () => {
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('photo', file.photo as File);
        formData.append('member_nomination', file.member_nomination.toString());
        formData.append('before_after', file.before_after);
        formData.append('name', file.name!);
        await setModelPhotos(formData);
        router.replace('/profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mutation = useMutation(uploadPhotos);

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Загрузите Фото">
        <GoBackButton />
        <Image src={uploadPhtotoBackg} alt="Выберите Фото" width={362} />
        <h3 className={styles.upload_photo__title}>Загрузите фото модели</h3>
        <p className={styles.upload_photo__nomination}>
          {model?.nomination} {model?.category}
        </p>
        <form className={styles.upload_photo__form}>
          <div className={styles.upload_photo__box}>
            <span>ДО</span>
            <ul className={styles.upload_photo__list}>
              {model?.nomination_info.after.map((afterPhoto, index) => (
                <li key={index} className={styles.upload_photo__item}>
                  <label className={styles.upload_photo__label}>
                    <input type="file" onChange={handleFileChange(index)} />
                    <Image
                      src={getImageSrc(index)}
                      alt="Выбранное фото"
                      width={80}
                      height={80}
                      className={styles.upload_photo__image}
                    />
                    <span>{afterPhoto.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.upload_photo__box}>
            <span>ПОСЛЕ</span>
            <ul className={styles.upload_photo__list}>
              {model?.nomination_info.before.map((beforePhoto, index) => (
                <li key={index} className={styles.upload_photo__item}>
                  <label className={styles.upload_photo__label}>
                    <input
                      type="file"
                      onChange={handleFileChange(
                        index + model?.nomination_info.after.length
                      )}
                    />
                    <Image
                      src={getImageSrc(
                        index + model?.nomination_info.after.length
                      )}
                      alt="Выбранное фото"
                      width={80}
                      height={80}
                      className={styles.upload_photo__image}
                    />
                    <span>{beforePhoto.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </form>
        <Button
          disabled={buttonIsDisabled()}
          className={styles.upload_photo__btn}
          onClick={() => mutation.mutate()}
        >
          Подтвердить
        </Button>
      </Layout>
    </div>
  );
};

export default UploadPhotoPage;
