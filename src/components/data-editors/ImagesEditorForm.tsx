import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes } from '@/app/enums';
import { useState } from 'react';
import { deleteObject, ref, StorageReference, uploadBytes } from '@firebase/storage';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { ImagesViewer } from '@/components/data-editors/ImagesViewer';
import { storage } from '@/app/lib/firebase-config';

interface ImagesEditorFormProps {
  images?: StorageReference[];
  refreshCallback?: () => void;
}

export function ImagesEditorForm({images, refreshCallback}: ImagesEditorFormProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StorageReference>();
  const [files, setFiles] = useState<FileList>();

  const uploadFiles = async () => {
    setLoading(true);
    try {
      if (files) {
        await Promise.all(Object.values(files).map(async (file) => {
          const arrBuffer = await file.arrayBuffer();
          return uploadBytes(ref(storage, file.name), new Blob([arrBuffer]));
        }))
        dispatch(setNotificationMessage(TRANSLATES[LOCALE].imagesUploaded));
        refreshCallback?.();
      }
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    } finally {
      setLoading(false);
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
      refreshCallback?.();
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    }
  };

  return (
    <>
      <ImagesViewer storageData={images} editAvailable={true} deleteImageClick={deleteImg}/>

      <label className="flex flex-col justify-center items-center border-dashed w-full rounded-md border-pink-500 border-2 mt-2 mb-2 p-6 cursor-pointer">
        <input
          className="invisible h-0"
          type="file"
          multiple={true}
          onChange={(event) => setFiles(event?.target?.files)}
        />
        {
          files
            ? Object.values(files).map((file) => (<div key={file.name}>{file.name}</div>))
            : <span>{TRANSLATES[LOCALE].chooseFiles}</span>
        }
      </label>

      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={loading}
        loading={loading}
        type={ButtonTypes.SUBMIT}
        callback={uploadFiles}
      >{TRANSLATES[LOCALE].save}</Button>
    </>
  );
}