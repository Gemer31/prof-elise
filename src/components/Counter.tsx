'use client';

import { ButtonType, FirestoreCollections } from '@/app/enums';
import { useEffect, useMemo, useState } from 'react';
import { useCounter } from '@uidotdev/usehooks';
import { CLIENT_ID } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ICartProductModel, IClient } from '@/store/dataSlice';
import { doc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { updateClient } from '@/store/asyncThunk';
import { Loader } from '@/components/Loader';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';

interface ICounterProps {
  productId: string;
}

export function Counter({productId}: ICounterProps) {
  const [initialized, setInitialized] = useState(false);
  const [count, {increment, decrement, set}] = useCounter();
  const clientId = useMemo(() => localStorage?.getItem(CLIENT_ID), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const cartCount = useAppSelector(state => state.dataReducer.client?.cart?.[productId]?.count);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    if (!cartLoading) {
      set(cartCount === undefined ? 0 : cartCount);
      setTimeout(() => setInitialized(true));
    }
  }, [cartLoading]);

  useEffect(() => {
    if (initialized) {
      if (count) {
        const newCart: Record<string, ICartProductModel> = {};
        Object.keys(client.cart).forEach((item) => {
          newCart[item] = {...client.cart[item]};
        });
        if (newCart[productId]) {
          newCart[productId].count = count;
        } else {
          newCart[productId] = {
            count,
            productRef: doc(db, FirestoreCollections.PRODUCTS, productId)
          };
        }
        dispatch(updateClient({
          clientId,
          data: {...client, cart: newCart}
        }));
      } else {
        const newCart: Record<string, ICartProductModel> = {};
        Object.keys(client.cart).forEach((item) => {
          newCart[item] = {...client.cart[item]};
        });
        delete newCart[productId];
        dispatch(updateClient({
          clientId,
          data: {...client, cart: newCart}
        }));
      }
    }
  }, [count]);

  const onInputChange = (e) => {
    set(Number(e['target']['value']));
  };

  return cartLoading && !initialized
    ? <Loader className="h-[25px] border-pink-500"/>
    : cartCount
      ? <div className="justify-center h-full transition-all flex rounded-md text-amber-50"
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }}>
        <button type="button" className="w-[40px] bg-pink-500 rounded-md" onClick={decrement}>
          <div className="hover:scale-125 duration-150">-</div>
        </button>
        <input
          className="rounded-md text-pink-500 w-[40px] text-center border-pink-500 border-2 mx-0.5"
          type="number"
          value={count}
          onBlur={onInputChange}
        />
        <button type="button" className="w-[40px] bg-pink-500 rounded-md" onClick={increment}>
          <div className="hover:scale-125 duration-150">+</div>
        </button>
      </div>
      : <Button
        styleClass="text-amber-50 w-full px-4 py-2 text-nowrap"
        type={ButtonType.BUTTON}
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          set(1);
        }}
      >{TRANSLATES[LOCALE].intoCart}</Button>;
}