import { useState, useRef, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import styles from './AvatarCropper.module.scss';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from 'store';
import { IUser } from 'common/shared/types';
import Avatar from 'common/shared/ui/avatar/Avatar';
interface AvatarCropperProps {
  children?: React.ReactNode;
  childrenClassName?: string;
}

const AvatarCropper = ({ children, childrenClassName }: AvatarCropperProps) => {
  const [scale, setScale] = useState(2);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const editorRef = useRef<AvatarEditor | null>(null);
  const [selectedImage, setSelectedImage] = useState(''); // Состояние для хранения выбранного изображения
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rotate, setRotate] = useState(180);
  const setAvatar = useSetAtom<any>(userAtom);
  const user = useAtomValue(userAtom);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setPreview(dataUrl);
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
          <div className={styles.modal__content}>
            <AvatarEditor
              style={{ borderRadius: '10px' }}
              image={selectedImage} // Используем выбранное изображение для редактирования
              width={330}
              height={330}
              border={20}
              borderRadius={180}
              scale={scale}
              position={position}
              disableHiDPIScaling
              onPositionChange={(newPosition: any) => setPosition(newPosition)}
              ref={editorRef} // Привязываем ref к компоненту AvatarEditor
              color={[243, 243, 243, 0.697]}
              rotate={rotate - 180}
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
            <input
              className={styles.input_range}
              type="range"
              min="0"
              max="360"
              step="0.01"
              value={rotate}
              onChange={(event) => setRotate(parseInt(event.target.value))}
            />

            <button className={styles.UI_button} onClick={handleSave}>
              Сохранить
            </button>
            <button onClick={handleClose}>Закрыть</button>
          </div>
        </div>
      )}
      {children && (
        <>
          <label className={childrenClassName}>
            {children}
            <input
              className={styles.avatar_input}
              type="file"
              onChange={handleImageSelect}
              accept="image/jpg, image/jpeg, image/png, image/svg"
            />
          </label>
        </>
      )}

      {!children && (
        <>
          <label className={styles.auth_label}>
            Загрузите ваше лучшее фото Профиля
            <input
              className={styles.avatar_input}
              type="file"
              onChange={handleImageSelect}
              accept="image/jpg, image/jpeg, image/png, image/svg"
            />
            <span className={styles.avatar_input_style}>Выбрать фото</span>
          </label>
          {user?.image && <Avatar />}

          {/* {preview && (
            <img
              src={preview}
              className={styles.avatar_preview}
              alt="Preview"
            />
          )} */}
        </>
      )}
    </>
  );
};

export default AvatarCropper;