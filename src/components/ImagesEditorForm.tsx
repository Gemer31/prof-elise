import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useRef, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { deleteObject, ref, StorageReference, uploadBytes } from '@firebase/storage';
import Image from 'next/image';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { storage } from '@/utils/firebaseModule';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { ImagesViewer } from '@/components/ImagesViewer';

interface ImagesEditorFormProps {
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function ImagesEditorForm({storageData, refreshData}: ImagesEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StorageReference | null>();
  const [files, setFiles] = useState<FileList | null>();
  const filesRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async () => {
    setIsLoading(true);
    try {
      if (files) {
        Object.values(files).forEach(async (file) => {
          const arrBuffer = await file.arrayBuffer();
          await uploadBytes(ref(storage, file.name), new Blob([arrBuffer]));
        });
        dispatch(setNotificationMessage(TRANSLATES[LOCALE].imagesUploaded));
        refreshData?.();
      }
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImg = async (image: StorageReference) => {
    try {
      const desertRef = ref(storage, image.fullPath);
      await deleteObject(desertRef);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].imageDeleted));
      if (image.name === selectedImage?.name) {
        setSelectedImage(null);
      }
      refreshData?.();
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    }
  };

  return (
    <>
      <ImagesViewer storageData={storageData} editAvailable={true} deleteImageClick={deleteImg}/>

      <label className="flex flex-col justify-center items-center border-dashed w-full rounded-md border-pink-500 border-2 mt-6 mb-2 p-6 cursor-pointer">
        <input
          className="invisible h-0"
          ref={filesRef}
          type="file"
          multiple={true}
          onChange={(event) => setFiles(event?.target?.files)}
        />
        {
          files
            ? Object.values(files).map((file) => (<div key={file.name}>{file.name}</div>))
            : <span>Выберите файлы</span>
        }
      </label>

      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
        callback={uploadFiles}
      >{TRANSLATES[LOCALE].save}</Button>
    </>
  );
}