import React from 'react';
import styles from './upload-photo.module.scss';
import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import UploadPhotoForm from 'common/features/upload-member-photo/ui/UploadPhotoForm/UploadPhotoForm';

const UploadPhotoPage = () => {
  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Загрузите Фото">
        <GoBackButton />
        <UploadPhotoForm />
      </Layout>
    </div>
  );
};

export default UploadPhotoPage;
