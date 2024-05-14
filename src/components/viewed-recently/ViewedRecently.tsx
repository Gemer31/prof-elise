'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { IConfig, IProduct } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { IClient, IViewedRecentlyModel } from '@/store/dataSlice';
import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import Link from 'next/link';
import './viewed-recently.css';

interface IViewedRecentlyProps {
  config: IConfig;
}

export function ViewedRecently({config}: IViewedRecentlyProps) {
  const [data, setData] = useState<(IViewedRecentlyModel & { product: IProduct })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    const productsIds = client?.viewedRecently && Object.keys(client.viewedRecently);

    if (productsIds?.length) {
      getDocs(query(collection(db, FirestoreCollections.PRODUCTS), where('id', 'in', productsIds)))
        .then((productsQuerySnapshot) => {
          setData(Object.values(client.viewedRecently)
            .toSorted((first, second) => second?.time - first?.time)
            .map((item) => (
              {
                ...item,
                product: productsQuerySnapshot.docs.find(p => p.id === item.productRef.id).data() as IProduct
              })
            )
          );
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [client?.viewedRecently]);

  return data.length && !isLoading
    ? <div className="w-full bg-slate-100 flex flex-col items-center h-full py-4">
      <ContentContainer styleClass="flex justify-start px-2">
        <div>
          <h2 className="text-xl font-bold">{TRANSLATES[LOCALE].youViewed}</h2>
          <div className="py-2 grid grid-cols-5 gap-x-2">
            {
              data?.map(item => {
                return <Link
                  href={`${RouterPath.CATEGORIES}/${item.product?.categoryRef.id}${RouterPath.PRODUCTS}/${item.product?.id}`}
                  key={item.product?.id}
                  className="flex items-center p-4 rounded-md bg-white hover:bg-pink-200 duration-500 transition-colors"
                >
                  <Image width={55} height={55} src={item.product?.imageUrls[0]} alt={item.product?.title}/>
                  <div className="ml-2">
                    <div className="viewed-recently__card-title text-base">{item.product?.title}</div>
                    <div className="font-light">{item.product?.price} {config.currency}</div>
                  </div>
                </Link>;
              })
            }
          </div>
        </div>
      </ContentContainer>
    </div>
    : <></>;
}