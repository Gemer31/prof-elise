'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { doc, DocumentReference } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { CLIENT_ID } from '@/app/constants';
import { updateClient } from '@/store/asyncThunk';
import { Loader } from '@/components/Loader';
import { convertToClass } from '@/utils/convert-to-class.util';

export interface IEntityFavouriteButtonProps {
  productId: string;
  className?: string;
}

export function EntityFavouriteButton({productId, className}: IEntityFavouriteButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const clientId = useMemo(() => localStorage.getItem(CLIENT_ID), []);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const isFavourite = useAppSelector(state => state.dataReducer.client?.['favourites']?.[productId]);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  const hostClass: string = useMemo(() => convertToClass([
    'entity-favourite-button',
    'cursor-pointer',
    'absolute',
    'transition-transform',
    'hover:scale-110',
    'duration-200',
    isLoading ? 'pointer-events-none' : '',
    className || '',
  ]), [className, isLoading]);

  useEffect(() => {
    if (!cartLoading) {
      setIsLoading(false);
    };
  }, [cartLoading, isFavourite]);

  const favouriteClick = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const newFavourites = {...client.favourites} as Record<string, DocumentReference>;

    if (isFavourite) {
      delete newFavourites[productId];
    } else {
      newFavourites[productId] = doc(db, FirestoreCollections.PRODUCTS, productId);
    }

    setIsLoading(true);
    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        favourites: newFavourites
      }
    }));
  };

  return <div className={hostClass} onClick={favouriteClick}>
    {
      isLoading
        ? <Loader styleClass="h-[25px] border-pink-500"/>
        : isFavourite
          ? <Image width={25} height={25} src="/icons/heart-filled.svg" alt="favourite"/>
          : <Image className="" width={25} height={25} src="/icons/heart.svg" alt="favourite"/>
    }
  </div>;
}