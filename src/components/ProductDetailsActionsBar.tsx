'use client';

import { Counter } from '@/components/Counter';
import { ButtonTypes, FirestoreCollections, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { IClient, IViewedRecentlyModel, setRequestCallPopupVisible } from '@/store/dataSlice';
import { useEffect, useMemo } from 'react';
import { getClientId } from '@/utils/cookies.util';
import { updateClient } from '@/store/asyncThunk';
import { doc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';

interface IProductDetailsActionsBarProps {
  // client: IClient;
  productId: string;
}

export function ProductDetailsActionsBar({productId, }: IProductDetailsActionsBarProps) {
  const clientId = useMemo(() => getClientId(), []);
  // @ts-ignore
  const cartCount = useAppSelector(state => state.dataReducer.client?.cart?.[productId]?.count);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log(client.viewedRecently);
    // if (!client.viewedRecently?.[productId]) {
    //   const newViewedRecently: Record<string, IViewedRecentlyModel> = {};
    //
    //
    //   const newViewedRecentlyData = [...data];
    //   newViewedRecentlyData.forEach((item, index) => {
    //     delete item.product;
    //     if (newViewedRecentlyData.length < 5) {
    //       newViewedRecently[item.productRef.id] = item;
    //     } else {
    //       if (index !== newViewedRecentlyData.length - 1) {
    //         newViewedRecently[item.productRef.id] = item;
    //       }
    //     }
    //   });
    //
    //   dispatch(updateClient({
    //     clientId,
    //     data: {
    //       ...client,
    //       viewedRecently: {
    //         ...newViewedRecently,
    //         [productId]: {
    //           time: +new Date(),
    //           productRef: doc(db, FirestoreCollections.PRODUCTS, productId),
    //         }
    //       }
    //     }
    //   }));
    // }
  }, []);

  return <div className="flex gap-x-2 items-center w-fit">
    {
      cartCount
        ? <Button
          styleClass="text-white py-2 px-4"
          type={ButtonTypes.BUTTON}
          callback={() => router.push(RouterPath.CART)}
        >
          <div className="w-max">{TRANSLATES[LOCALE].alreadyInCart}</div>
          <span className="text-xs">{TRANSLATES[LOCALE].goto}</span>
        </Button>
        : <></>
    }
    <Counter productId={productId}/>
    <Button
      styleClass="text-white w-full py-2 px-4"
      type={ButtonTypes.BUTTON}
      callback={() => dispatch(setRequestCallPopupVisible(true))}
    >{TRANSLATES[LOCALE].buyInOneClick}</Button>
  </div>;
}