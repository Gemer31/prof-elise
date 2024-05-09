'use client'

import { IConfig } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Loader } from '@/components/Loader';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface IFavouritesListProps {
  config: IConfig;
  cart: unknown;
}
export function FavouritesList({config, cart}: IFavouritesListProps) {
  const favourites = useAppSelector(state => state.dataReducer.cart);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  const [favouritesLength, setFavouritesLength] = useState(0);
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  // return cartLoading
  //   ? <div className="w-full flex justify-center mt-4 overflow-hidden">
  //     <Loader styleClass="min-h-[250px] border-pink-500"
  //     /></div>
  //   : (
  //     favouritesLength
  //       ? Object.values(favourites).map((favourite) => {
  //         return
  //       })
  //       : <div className="w-full flex justify-center items-center text-3xl text-center">
  //         <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
  //         <span>{TRANSLATES[LOCALE].emptyCart}</span>
  //       </div>
  //   )
  return <div>as</div>
}