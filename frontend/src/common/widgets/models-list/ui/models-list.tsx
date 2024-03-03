import { IModel, ModelItem } from 'common/entities/model';
import { getModels } from 'common/shared/api/models';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import styles from './models-list.module.scss';
import { useAtomValue } from 'jotai';
import { champAtom } from 'store';

export const ModelsList = () => {
  const [models, setModels] = useState<IModel[]>();
  const champ = useAtomValue(champAtom);

  const getModelsList = useMutation(async () => {
    try {
      const { data } = await getModels(champ.id);
      setModels(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getModelsList.mutateAsync();
  }, []);

  return (
    <ul className={styles.models__list}>
      {models?.map((model) => (
        <ModelItem key={model.id} model={model} />
      ))}
    </ul>
  );
};

export default ModelsList;
