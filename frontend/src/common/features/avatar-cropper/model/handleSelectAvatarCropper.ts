import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const handleSelectAvatarCropper = (
  setShowModal: Dispatch<SetStateAction<boolean>>,
  setSelectedImage: Dispatch<SetStateAction<File | undefined>>,
  event: ChangeEvent<HTMLInputElement>
) => {
  if (event.target.files && event.target.files[0]) {
    setShowModal(true);
    const file = event.target.files[0];
    setSelectedImage(file);
    event.target.value = '';
  }
};
