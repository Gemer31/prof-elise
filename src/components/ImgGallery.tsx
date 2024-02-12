'use client'

import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { useEffect, useState } from 'react';
import { converImageUrlsToGallery } from '@/utils/firebase.util';

interface IImgGalleryProps {
  imageUrls: string[] | undefined;
}

export function ImgGallery({imageUrls}: IImgGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gallery, setGallery] = useState<ReactImageGalleryItem[]>([]);

  useEffect(() => {
    if (imageUrls?.length) {
      setGallery(converImageUrlsToGallery(imageUrls))
    }
  }, [imageUrls]);

  return (
    <ImageGallery
      additionalClass={isFullscreen ? '' : 'gallery-small'}
      onScreenChange={setIsFullscreen}
      useBrowserFullscreen={false}
      showBullets={true}
      showPlayButton={false}
      showThumbnails={false}
      items={gallery}
    />
  )
}