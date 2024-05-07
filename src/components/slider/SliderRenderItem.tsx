import { ReactImageGalleryItem } from 'react-image-gallery';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';

export function SliderRenderItem({description, original}: ReactImageGalleryItem) {
  return <div className="flex justify-center relative">
    <div className="absolute left-0 top-0 w-full h-full bg-black-1/4 z-10"></div>
    <ContentContainer styleClass="relative flex flex-col">
      <img src={original} alt={description}/>
      <div className="absolute h-full top-0 bottom-0 flex justify-center flex-col z-20 mx-10">
        <h2 className="text-amber-50 text-3xl mb-4">{description}</h2>
        <Button
          styleClass="hidden md:block text-amber-50 px-6 py-4 w-fit"
          type={ButtonType.BUTTON}>{TRANSLATES[LOCALE].getDetails}</Button>
      </div>
    </ContentContainer>
  </div>
}