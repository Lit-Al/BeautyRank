import unknownAvatar from '@public/images/unknown-avatar.svg';
import { IPhoto } from '../lib/types';

interface IuseMemberImageSrc {
  selectedFiles: IPhoto[];
}

export const useMemberImageSrc = ({ selectedFiles }: IuseMemberImageSrc) => {
  const getImageSrc = (index: number) => {
    const selectedFile = selectedFiles[index];
    if (selectedFile && selectedFile.photo) {
      return URL.createObjectURL(selectedFile.photo as Blob);
    }
    return unknownAvatar;
  };

  return { getImageSrc };
};
