import unknownAvatar from '@/public/images/unknown-avatar.svg';
import { IPhoto } from './types';

interface IUseImageSrc {
  selectedFiles: IPhoto[];
}

export const useImageSrc = ({ selectedFiles }: IUseImageSrc) => {
  const getImageSrc = (index: number) => {
    const selectedFile = selectedFiles[index];
    if (selectedFile && selectedFile.photo) {
      return URL.createObjectURL(selectedFile.photo as Blob);
    }
    return unknownAvatar;
  };

  return { getImageSrc };
};
