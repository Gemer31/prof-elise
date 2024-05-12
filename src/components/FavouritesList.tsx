'use client';

import { IProduct } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Loader } from '@/components/Loader';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { doc, DocumentReference, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';

export function FavouritesList() {
  const [data, setData] = useState<IProduct[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  // @ts-ignore
  const favourites = useAppSelector(state => state.dataReducer.client['favourites']);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);

  useEffect(() => {
    if (!cartLoading) {
      let docs;

      if (favourites) {
        docs = Object.values<DocumentReference>(favourites);
      }
      if (docs?.length) {
        // think about better solution
        Promise.all(docs.map((item) => getDoc(doc(db, item.path.at(-1), item.path.at(-2)))))
          .then((favouriteProducts) => {
            const products = favouriteProducts.map((p) => p.data() as IProduct);
            console.log(favouriteProducts);
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
        ? Object.values(data).map((favourite) => {
          return <div className="grid grid-cols-4">
            {JSON.stringify(favourite)}
          </div>
        })
        : <div className="w-full flex justify-center items-center text-3xl text-center">
          <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
          <span>{TRANSLATES[LOCALE].emptyCart}</span>
        </div>
    )
}