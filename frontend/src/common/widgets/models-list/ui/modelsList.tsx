import { IModel, ModelCard } from 'common/entities/model';
import { getModels } from 'common/shared/api/models';
import { useAtomValue } from 'jotai';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { champAtom, userAtom } from 'store';
import styles from './modelsList.module.scss';
import { Loader } from 'common/shared/ui/loader';

export const ModelsList = () => {
  const [models, setModels] = useState<IModel[]>();
  const [currentMasterModels, setCurrentMasterModels] = useState<IModel[]>([]);
  const [otherMasterModels, setOtherMasterModels] = useState<IModel[]>([]);
  const champ = useAtomValue(champAtom);
  const userIsStaff = champ.role === 'Судья';
  const user = useAtomValue(userAtom);

  const getModelsList = useMutation(async () => {
    try {
      const { data } = await getModels(champ.id);
      setModels(data);
      const currentMasterModels = data.filter((model) =>
        model.member.includes(user?.last_name!)
      );
      const otherMasterModels = data.filter(
        (model) => !model.member.includes(user?.last_name!)
      );

      setCurrentMasterModels(currentMasterModels);
      setOtherMasterModels(otherMasterModels);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getModelsList.mutateAsync();
  }, []);

  return (
    <>
      {models ? (
        <>
          {userIsStaff ? (
            <>
              <ul
                className={`${styles.models__list} ${
                  userIsStaff && styles.models__list_staff
                }`}
              >
                {models.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className={styles.models__title}>Ваши работы:</h3>
              <ul className={styles.models__list}>
                {currentMasterModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </ul>
              <h3 className={styles.models__title}>Работы других мастеров:</h3>
              {otherMasterModels.length !== 0 ? (
                <>
                  <ul
                    className={`${styles.models__list_other} ${styles.models__list}`}
                  >
                    {otherMasterModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </ul>
                </>
              ) : (
                <Loader />
              )}
            </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
