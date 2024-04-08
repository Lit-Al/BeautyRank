import { IUser } from 'common/shared/types';
import { Dispatch, SetStateAction } from 'react';

export const handleCloseAvatarCropper = (
  setShowModal: Dispatch<SetStateAction<boolean>>,
  user: IUser | null,
  setUser: Dispatch<SetStateAction<IUser | null>>
) => {
  setShowModal(false);
  if (!user?.image) {
    setUser((prev: any) => ({ ...prev, image: null }));
  }
};
