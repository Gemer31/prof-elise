'use client'

import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { useEffect, useState } from 'react';
import { converImageUrlsToGallery } from '@/utils/firebase.util';

interface IImgGalleryProps {
  imageUrls: string[];
}

export function ImgGallery({imageUrls}: IImgGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gallery, setGallery] = useState<ReactImageGalleryItem[]>([]);

  useEffect(() => {
    if (imageUrls?.length) {
      setGallery(converImageUrlsToGallery(imageUrls))
    }
  }, [imageUrls]);

  const changeScreen = (v: boolean) => {
    if (v) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    setIsFullscreen(v);
  }

  return (
    <ImageGallery
      additionalClass={`${isFullscreen ? 'gallery-fullscreen' : 'gallery-small'}`}
      onScreenChange={changeScreen}
      useBrowserFullscreen={false}
      showBullets={true}
      showPlayButton={false}
      showThumbnails={false}
      items={gallery}
    />
  )
}