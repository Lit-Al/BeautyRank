import { useState, useRef, ReactNode, ChangeEvent } from 'react';
import AvatarEditor from 'react-avatar-editor';
import styles from './AvatarCropper.module.scss';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from 'store';
import { IUser } from 'common/shared/types';
import Avatar from 'common/shared/ui/avatar/Avatar';
import Image from 'next/image';
import closeIcon from '@/public/images/close-icon.svg';
import { Button } from 'common/shared/ui/button';
interface AvatarCropperProps {
  children?: ReactNode;
  childrenClassName?: string;
}

const AvatarCropper = ({ children, childrenClassName }: AvatarCropperProps) => {
  const [scale, setScale] = useState(2);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const editorRef = useRef<AvatarEditor | null>(null);
  const [selectedImage, setSelectedImage] = useState(''); // Состояние для хранения выбранного изображения
  const [showModal, setShowModal] = useState(false);
  const setAvatar = useSetAtom<any>(userAtom);
  const user = useAtomValue(userAtom);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setShowModal(true);
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setShowModal(false);
    if (editorRef.current) {
      const dataUrl = editorRef.current.getImage().toDataURL();
      setAvatar((prev: IUser) => ({
        ...prev,
        image: dataUrl,
      }));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    if (!user?.image) {
      setAvatar((prev: IUser) => ({
        ...prev,
        image: null,
      }));
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <div
            onClick={() => setShowModal(false)}
            className={styles.blur}
          ></div>
          <div className={styles.modal__content}>
            <AvatarEditor
              style={{ borderRadius: '10px' }}
              image={selectedImage} // Используем выбранное изображение для редактирования
              width={320}
              height={320}
              borderRadius={180}
              scale={scale}
              position={position}
              disableHiDPIScaling
              onPositionChange={(newPosition: any) => setPosition(newPosition)}
              ref={editorRef}
              color={[243, 243, 243, 0.697]}
              border={0}
            />

            <input
              className={styles.input_range}
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={scale}
              onChange={(event) => setScale(parseFloat(event.target.value))}
            />

            <Button className={styles.UI_button} onClick={handleSave}>
              Сохранить
            </Button>
            <button onClick={handleClose} className={styles.close_modal}>
              <Image src={closeIcon} alt="Закрыть"></Image>
            </button>
          </div>
        </div>
      )}
      {children ? (
        <label className={childrenClassName}>
          {children}
          <input
            className={styles.avatar_input}
            type="file"
            onChange={handleImageSelect}
            accept="image/*"
          />
        </label>
      ) : (
        <>
          <label className={styles.auth_label}>
            Загрузите ваше лучшее фото Профиля
            <input
              className={styles.avatar_input}
              type="file"
              onChange={handleImageSelect}
              accept="image/*"
            />
            <span className={styles.avatar_input_style}>Выбрать фото</span>
          </label>
          {user?.image && <Avatar />}
        </>
      )}
    </>
  );
};

export default AvatarCropper;
