import { useMutation } from 'react-query';
import { IModel } from 'common/entities/model';
import { useState, useEffect } from 'react';
import { getModel } from 'common/shared/api/models';
import { IPhoto } from './types';

export const useModel = (modelId: number) => {
  const [model, setModel] = useState<IModel>();
  const [selectedFiles, setSelectedFiles] = useState<IPhoto[]>([]);

  const getModelItem = useMutation(async () => {
    try {
      if (modelId) {
        const { data } = await getModel(modelId);
        console.log(data);

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
    getModelItem.mutateAsync();
  }, [modelId]);

  return { model, selectedFiles, setSelectedFiles, getModelItem };
};
