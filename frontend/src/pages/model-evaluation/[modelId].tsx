import React, { useEffect, useState } from 'react';
import styles from './model-evaluation.module.scss';
import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { getModel, getModelPhotos } from 'common/shared/api/models';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { IModel } from 'common/entities/model';
import Image from 'next/image';
import { IPhoto } from 'common/features/upload-model-photo/model';
import { Loader } from 'common/shared/ui/loader';

const ModelEvaluationPage = () => {
  const router = useRouter();
  const modelId = Number(router.query.modelId);
  const [model, setModel] = useState<IModel>();
  const [modelPhotos, setModelPhotos] = useState<IPhoto[]>();

  const getModelItem = useMutation(async () => {
    try {
      if (modelId) {
        const { data } = await getModelPhotos(modelId);
        const { data: modelData } = await getModel(modelId);
        console.log(data);
        console.log(modelData);
        setModel(modelData);
        setModelPhotos(data);
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getModelItem.mutateAsync();
  }, [modelId]);

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Оцените Работу">
        <GoBackButton />
        <h1 className={styles.evaluation__title}>Оцените Участника</h1>
        <div className={styles.evaluation__box}>
          <div>
            <p className={styles.evaluation__separation}>ДО</p>
            <ul className={styles.evaluation__list}>
              {modelPhotos?.map((modelData) => (
                <>
                  {modelData.before_after === 'BE' && (
                    <li className={styles.evaluation__item}>
                      <Image
                        className={styles.evaluation__img}
                        src={modelData.photo as string}
                        width={75}
                        height={75}
                        alt={modelData.name}
                      />
                      <span className={styles.evaluation__name}>
                        {modelData.name}
                      </span>
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
          <div>
            <p className={styles.evaluation__separation}>ПОСЛЕ</p>
            <ul className={styles.evaluation__list}>
              {modelPhotos?.map((modelData) => (
                <>
                  {modelData.before_after === 'AF' && (
                    <li className={styles.evaluation__item}>
                      <Image
                        className={styles.evaluation__img}
                        src={modelData.photo as string}
                        width={75}
                        height={75}
                        alt={modelData.name}
                      />
                      <span className={styles.evaluation__name}>
                        {modelData.name}
                      </span>
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        </div>
        <h2 className={styles.evaluation__category}>
          {model?.nomination} {model?.category}
        </h2>
      </Layout>
    </div>
  );
};

export default ModelEvaluationPage;
