import { base64ToFileFunction } from 'common/shared/helpers';
import { IUser } from 'common/shared/types';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { UseMutationResult } from 'react-query';

export const handleSaveAvatarCropper = (
  setShowModal: Dispatch<SetStateAction<boolean>>,
  editorRef: MutableRefObject<AvatarEditor | null>,
  mutation: UseMutationResult<void, unknown, IUser, unknown>,
  setUser: Dispatch<SetStateAction<IUser | null>>
) => {
  setShowModal(false);
  const avatarFile = base64ToFileFunction(
    editorRef.current!.getImage().toDataURL()
  );
  const formData = new FormData();
  formData.append('image', avatarFile!);
  mutation.mutate(formData as unknown as IUser);
  //@ts-ignore
  //todo поправить типизацию
  setUser((prev: IUser) => ({ ...prev, image: avatarFile }));
};
