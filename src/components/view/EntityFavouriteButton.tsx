'use client';

import Image from 'next/image';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { doc } from '@firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { updateFavourites } from '@/store/asyncThunk';
import { Loader } from '@/components/ui/Loader';
import { convertToClass } from '@/utils/convert-to-class.util';
import { getClientId } from '@/utils/cookies.util';
import { SerializationUtil } from '@/utils/serialization.util';
import { revalidateFavourites } from '@/app/actions';

interface IEntityFavouriteButtonProps {
  productId: string;
  className?: string;
}

export function EntityFavouriteButton({ productId, className }: IEntityFavouriteButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const cartLoading = useAppSelector((state) => state.dataReducer.cartLoading);
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector((state) => state.dataReducer.favourites?.[productId]);
  const favourites = useAppSelector((state) => state.dataReducer.favourites);

  const hostClass: string = useMemo(() => convertToClass([
    'entity-favourite-button',
    'cursor-pointer',
    'transition-transform',
    'hover:scale-110',
    'duration-200',
    isLoading ? 'pointer-events-none' : '',
    className || '',
  ]), [className, isLoading]);

  useEffect(() => {
    !cartLoading && setIsLoading(false);
  }, [cartLoading, isFavourite]);

  const favouriteClick = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const data = SerializationUtil.getNonSerializedFavourites(favourites);

    if (isFavourite) {
      delete data[productId];
    } else {
      data[productId] = doc(db, FirestoreCollections.PRODUCTS, productId);
    }

    dispatch(updateFavourites({ clientId: getClientId(), data }));
    setIsLoading(true);

    await revalidateFavourites();
  };

  return (
    <div className={hostClass} onClick={favouriteClick}>
      {
        isLoading
          ? <Loader className="h-[25px] border-pink-500"/>
          : isFavourite
            ? <Image width={25} height={25} src="/icons/heart-filled.svg" alt="favourite"/>
            : <Image className="" width={25} height={25} src="/icons/heart.svg" alt="favourite"/>
      }
    </div>
  );
}
