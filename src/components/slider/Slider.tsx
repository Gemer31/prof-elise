'use client'

import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import * as React from 'react';
import { useState } from 'react';
import { SliderRenderItem } from '@/components/slider/SliderRenderItem';
import { RouterPath } from '@/app/enums';
import { usePathname } from 'next/navigation';

export function Slider() {
  const pathname = usePathname();
  const [play, setPlay] = useState(true);

  const items: ReactImageGalleryItem[] = [
    {
      original: "https://dmm.by/images/slides/35_bg.jpg.webp?v=v6639f85e4b55a",
      description: "Расходные материалы для салонов красоты",
      renderItem: SliderRenderItem,
    },
    {
      original: "https://dmm.by/images/slides/32_bg.jpg.webp?v=v6639f85e4b55a",
      description: "Расходные материалы для медицинских центров",
      renderItem: SliderRenderItem,
    }
  ]
  return pathname === RouterPath.HOME ? <ImageGallery
    additionalClass="w-full my-4"
    useBrowserFullscreen={false}
    autoPlay={play}
    slideInterval={5000}
    infinite={true}
    showFullscreenButton={false}
    showBullets={true}
    showPlayButton={false}
    showThumbnails={false}
    onMouseLeave={() => setPlay(true)}
    onMouseOver={() => setPlay(false)}
    items={items}
  /> : <></>
}
