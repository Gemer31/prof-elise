'use client';

import { IProduct } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Loader } from '@/components/Loader';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { FavouriteProductCard } from '@/components/FavouriteProductCard';

export function FavouritesList() {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');
  const [data, setData] = useState<IProduct[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  // @ts-ignore
  const favourites = useAppSelector(state => state.dataReducer.client['favourites']);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);

  useEffect(() => {
    if (!cartLoading) {
      let productsIds: string[] = favourites && Object.keys(favourites);

      if (productsIds?.length) {
        getDocs(query(collection(db, FirebaseCollections.PRODUCTS), where('id', 'in', productsIds)))
          .then((favouriteProducts) => {
            const products: IProduct[] = favouriteProducts.docs.map((p) => p.data() as IProduct);
            setData(products);
            setDataLoading(false);
          });
      } else {
        setDataLoading(false);
      }
    }
  }, [cartLoading]);

  return cartLoading || dataLoading
    ? <div className="w-full flex justify-center mt-4 overflow-hidden">
      <Loader styleClass="min-h-[250px] border-pink-500"
      /></div>
    : (
      data?.length
        ? <div className="w-full">
        <div className="grid-cols-2">
          <span>{TRANSLATES[LOCALE].naming}</span>
          <span>{TRANSLATES[LOCALE].price}</span>
        </div>
          {
            data.map((favourite) => <FavouriteProductCard
              key={favourite.id}
              data={favourite}
              isLoading={redirectIdInProgress === favourite.id}
              onClick={() => setRedirectIdInProgress(favourite.id)}
            />)
          }
        </div>
        : <div className="w-full flex justify-center items-center text-3xl text-center">
          <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
          <span>{TRANSLATES[LOCALE].emptyCart}</span>
        </div>
    )
}