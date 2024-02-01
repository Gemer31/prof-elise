import Image from 'next/image';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { StorageReference } from '@firebase/storage';
import { useState } from 'react';

interface ImagesViewerProps {
  editAvailable?: boolean;
  deleteImageClick?: (image: StorageReference) => void;
  selectImageClick?: (image: StorageReference) => void;
  storageData?: StorageReference[];
}

export function ImagesViewer({editAvailable, storageData, deleteImageClick, selectImageClick}: ImagesViewerProps) {
  const [selectedImage, setSelectedImage] = useState<StorageReference | null>();

  const selectImage = (image: StorageReference) => {
    setSelectedImage(image);
    selectImageClick?.(image);
  }

  return (
    <div className="flex justify-between gap-4 mt-4">
      {
        storageData?.length
          ? <>
            <div className="overflow-y-hidden max-h-52 w-7/12 rounded-md border-pink-500 border-2 px-2 py-1">
              {
                storageData?.map((item) => (
                  <div
                    onClick={() => selectImage(item)}
                    key={item.fullPath}
                    className={`cursor-pointer flex justify-between items-center px-2 py-1 ${selectedImage?.name === item.name ? 'rounded-md bg-pink-300' : ''}`}
                  >
                    <span>{item.fullPath}</span>
                    {
                      editAvailable
                        ?
                        <Image onClick={() => deleteImageClick?.(item)} width={30} height={30} src="/icons/cross.svg" alt="Close"/>
                        : <></>
                    }
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
  );
}