'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useCounter } from '@uidotdev/usehooks';
import { doc } from '@firebase/firestore';
import { ButtonTypes, FirestoreCollections } from '@/app/enums';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { db } from '@/app/lib/firebase-config';
import { updateCart } from '@/store/asyncThunk';
import { Loader } from '@/components/ui/Loader';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { getClientId } from '@/utils/cookies.util';
import { ICartProductModel } from '@/app/models';
import { SerializationUtil } from '@/utils/serialization.util';

interface ICounterProps {
  productId: string;
  min?: number;
}

export function Counter({ productId, min }: ICounterProps) {
  const [initialized, setInitialized] = useState(false);
  const [count, { increment, decrement, set }] = useCounter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.dataReducer.cart);
  const cartCount = useAppSelector((state) => state.dataReducer.cart?.[productId]?.count);
  const cartLoading = useAppSelector((state) => state.dataReducer.cartLoading);

  useEffect(() => {
    if (!cartLoading) {
      set(cartCount === undefined ? 0 : cartCount);
      setTimeout(() => setInitialized(true));
    }
  }, [cartLoading]);

  useEffect(() => {
    if (initialized) {
      const clientId: string = getClientId();
      const data: Record<string, ICartProductModel> = SerializationUtil.getNonSerializedCart(cart);

      if (count) {
        if (data[productId]) {
          data[productId].count = count;
        } else {
          data[productId] = {
            count,
            productRef: doc(db, FirestoreCollections.PRODUCTS, productId),
          };
        }
        dispatch(updateCart({ clientId, data }));
      } else {
        delete data[productId];
        dispatch(updateCart({ clientId, data }));
      }
    }
  }, [count]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    set(Number(e.target.value));
  };

  return cartLoading && !initialized
    ? <Loader className="h-[25px] border-pink-500"/>
    : cartCount
      ? (
        <div
          className="justify-center h-full transition-all flex rounded-md text-amber-50 min-h-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
      )
      : (
        <Button
          styleClass="text-amber-50 w-full px-4 py-2 text-nowrap"
          type={ButtonTypes.BUTTON}
          callback={(e) => {
            e.preventDefault();
            e.stopPropagation();
            set(1);
          }}
        >{TRANSLATES[LOCALE].intoCart}
        </Button>
      );
}
