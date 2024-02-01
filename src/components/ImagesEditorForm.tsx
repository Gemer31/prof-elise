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

interface ImagesEditorFormProps {
  storageData?: StorageReference[];
}

export function ImagesEditorForm({storageData}: ImagesEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);
  const imgItemClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

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
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    }
  };

  return (
    <>
      <div className="flex justify-between gap-4 mt-4">
        {
          storageData?.length
            ? <>
              <div className="overflow-y-hidden max-h-52 w-7/12 rounded-md border-pink-500 border-2 px-2 py-1">
                {
                  storageData?.map((item) => (
                    <div
                      key={item.fullPath}
                      className={`cursor-pointer flex justify-between items-center px-2 py-1 ${selectedImage?.name === item.name ? 'rounded-md bg-pink-300' : ''}`}
                    >
                      <span onClick={() => setSelectedImage(item)}>{item.fullPath}</span>
                      <Image onClick={() => deleteImg(item)} width={30} height={30} src="/icons/cross.svg" alt="Close"/>
                    </div>
                  ))
                }
              </div>
              <div className="w-6/12 flex items-center justify-center text-center rounded-md border-pink-500 border-2">
                {selectedImage
                  ? <Image width={200} height={200} src={getStorageImageSrc(selectedImage)} alt={selectedImage.name}/>
                  : <>{TRANSLATES[LOCALE].selectImage}</>
                }
              </div>
            </>
            : <div
              className="w-full text-center rounded-md border-pink-500 border-2 px-2 py-1">{TRANSLATES[LOCALE].noImages}</div>
        }
      </div>


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