'use client';

import { ButtonTypes, FirestoreCollections } from '@/app/enums';
import { ChangeEvent, useEffect, useState } from 'react';
import { useCounter } from '@uidotdev/usehooks';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { doc, DocumentReference } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { updateClient } from '@/store/asyncThunk';
import { Loader } from '@/components/ui/Loader';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { getClientId } from '@/utils/cookies.util';
import { ICartProductModel, IClient } from '@/app/models';

interface ICounterProps {
  productId: string;
  min?: number;
}

export function Counter({productId, min}: ICounterProps) {
  const [initialized, setInitialized] = useState(false);
  const [count, {increment, decrement, set}] = useCounter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(state => state.dataReducer.client?.cart?.[productId]?.count);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    if (!cartLoading) {
      set(cartCount === undefined ? 0 : cartCount);
      setTimeout(() => setInitialized(true));
    }
  }, [cartLoading]);

  useEffect(() => {
    if (initialized) {
      const clientId: string = getClientId();
      if (count) {
        const newCart: Record<string, ICartProductModel<DocumentReference>> = {};
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
        const newCart: Record<string, ICartProductModel<DocumentReference>> = {};
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

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    set(Number(e.target.value));
  };

  return cartLoading && !initialized
    ? <Loader className="h-[25px] border-pink-500"/>
    : cartCount
      ? <div className="justify-center h-full transition-all flex rounded-md text-amber-50 min-h-10"
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
             }}>
        <button
          type="button"
          disabled={min !== undefined && cartCount === min}
          className="w-[40px] bg-pink-500 rounded-md"
          onClick={decrement}
        >
          <div className="hover:scale-125 duration-150">-</div>
        </button>
        <input
          className="rounded-md text-pink-500 w-[40px] text-center border-pink-500 border-2 mx-0.5"
          type="number"
          value={count}
          onBlur={onInputChange}
        />
        <button
          type="button"
          className="w-[40px] bg-pink-500 rounded-md"
          onClick={increment}
        >
          <div className="hover:scale-125 duration-150">+</div>
        </button>
      </div>
      : <Button
        styleClass="text-amber-50 w-full px-4 py-2 text-nowrap"
        type={ButtonTypes.BUTTON}
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          set(1);
        }}
      >{TRANSLATES[LOCALE].intoCart}</Button>;
}