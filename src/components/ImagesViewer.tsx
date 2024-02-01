'use client';

import Image from 'next/image';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { StorageReference } from '@firebase/storage';
import { useEffect, useState } from 'react';
import { CTRL_CODE } from '@/app/constants';

interface ImagesViewerProps {
  editAvailable?: boolean;
  multiple?: boolean;
  selectedImages?: StorageReference[];
  deleteImageClick?: (image: StorageReference) => void;
  selectImageClick?: (image: StorageReference[]) => void;
  storageData?: StorageReference[];
}

export function ImagesViewer({
                               editAvailable,
                               storageData,
                               deleteImageClick,
                               selectImageClick,
                               multiple,
                               selectedImages
                             }: ImagesViewerProps) {
  const [chosenImages, setChosenImages] = useState<Record<string, StorageReference>>({});
  const [lastSelectedImage, setLastSelectedImage] = useState<StorageReference | undefined>(undefined);
  const [tabPressed, setTabPressed] = useState<boolean>();

  useEffect(() => {
    const newData: Record<string, StorageReference> = {};
    selectedImages?.forEach((img) => {
      newData[img.name] = img;
    });
    setChosenImages(newData);
    setLastSelectedImage(selectedImages?.at(-1));
  }, [chosenImages]);

  useEffect(() => {
    document.body.addEventListener('keydown', (event) => {
        if (event.keyCode === CTRL_CODE) {
          setTabPressed(true);
        }
      }
    );
    document.body.addEventListener('keyup', (event) => {
        if (event.keyCode === CTRL_CODE) {
          setTabPressed(false);
        }
      }
    );
  }, []);

  const selectImage = (image: StorageReference) => {
    setChosenImages((prev) => {
      let newImages;

      if (multiple && tabPressed) {
        newImages = {...prev};
        if (newImages[image.name]) {
          delete newImages[image.name];
        } else {
          newImages[image.name] = image;
        }
      } else {
        newImages = {
          [image.name]: image
        };
      }

      selectImageClick?.(Object.values(newImages));
      return newImages;
    });
    setLastSelectedImage(image);
  };

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
                    className={`cursor-pointer flex justify-between items-center px-2 py-1 ${chosenImages[item.name] ? 'rounded-md bg-pink-300' : ''}`}
                  >
                    <span>{item.fullPath}</span>
                    {
                      editAvailable
                        ?
                        <Image onClick={() => deleteImageClick?.(item)} width={30} height={30} src="/icons/cross.svg"
                               alt="Close"/>
                        : <></>
                    }
                  </div>
                ))
              }
            </div>
            <div className="w-6/12 flex items-center justify-center text-center rounded-md border-pink-500 border-2">
              {lastSelectedImage
                ?
                <Image width={200} height={200} src={getStorageImageSrc(lastSelectedImage)} alt={lastSelectedImage.name}/>
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