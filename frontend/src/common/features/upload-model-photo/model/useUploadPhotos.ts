import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { IPhoto } from './types';
import { setModelPhotos } from 'common/shared/api/models';

interface IUseUploadPhotos {
  selectedFiles: IPhoto[];
}

export const useUploadPhotos = ({ selectedFiles }: IUseUploadPhotos) => {
  const router = useRouter();

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

  return { mutation };
};

