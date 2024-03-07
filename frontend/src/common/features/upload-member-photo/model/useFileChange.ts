import { IMember } from 'common/entities/member';
import { IPhoto } from '../lib';

interface IUseFileChange {
  member: IMember | undefined;
  memberId: number;
  selectedFiles: IPhoto[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<IPhoto[]>>;
}

export const useFileChange = ({
  member,
  memberId,
  setSelectedFiles,
}: IUseFileChange) => {
  const handleFileChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      const isAfter = index < member?.nomination_info.after.length!;
      const name = isAfter
        ? member?.nomination_info.after[index].name
        : member?.nomination_info.before[
            index - member?.nomination_info.after.length
          ].name;
      const beforeAfter = isAfter ? 'BE' : 'AF';

      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.map((selectedFile, i) =>
          i === index
            ? {
                member_nomination: memberId,
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
