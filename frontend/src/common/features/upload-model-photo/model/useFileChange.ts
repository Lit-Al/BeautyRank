import { IModel } from 'common/entities/model';
import { IPhoto } from './types';

interface IUseFileChange {
  model: IModel | undefined;
  modelId: number;
  selectedFiles: IPhoto[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<IPhoto[]>>;
}

export const useFileChange = ({
  model,
  modelId,
  setSelectedFiles,
}: IUseFileChange) => {
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

  return { handleFileChange };
};
