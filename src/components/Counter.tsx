'use client';

import { Button } from '@/components/Button';
import { ButtonType, CounterType, FirestoreCollections } from '@/app/enums';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useCounter } from '@uidotdev/usehooks';
import { CLIENT_ID } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ICartProductModel, IClient } from '@/store/dataSlice';
import { doc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { updateClient } from '@/store/asyncThunk';

interface ICounterProps {
  productId: string;
  initValue: number;
  type?: CounterType;
  selectedAmount?: number;
  counterChangedCallback: (amount: number) => void;
}

export function Counter({productId, type, counterChangedCallback, selectedAmount}: ICounterProps) {
  const [count, {increment, decrement, set}] = useCounter(1, {min: 0});
  const [initialized, setInitialized] = useState(false);

  const clientId = useMemo(() => localStorage?.getItem(CLIENT_ID), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const counter = useAppSelector(state => state.dataReducer.client?.cart?.[productId]?.count);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  const addToCart = (event?: MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();

    const newCart: Record<string, ICartProductModel> = {};
    Object.keys(client.cart).forEach((item) => {
      newCart[item] = {...client.cart[item]};
    });

    if (newCart[productId]) {
      newCart[productId].count += 1;
    } else {
      newCart[productId] = {
        count: 1,
        productRef: doc(db, FirestoreCollections.PRODUCTS, productId)
      };
    }

    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: newCart
      }
    }));
  };

  const removeFromCart = () => {
    const newCart: Record<string, ICartProductModel> = {};
    Object.keys(client.cart).forEach((item) => {
      newCart[item] = {...client.cart[item]};
    });

    newCart[productId].count -= 1;
    newCart[productId].count === 0 && delete newCart[productId];

    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: newCart
      }
    }));
  };

  useEffect(() => {
    selectedAmount && set(selectedAmount);
  }, []);

  useEffect(() => {
    if (initialized) {
      counterChangedCallback(count);
    }
  }, [count]);

  const incr = () => {
    setInitialized(true);
    increment();
  }
  const decr = () => {
    setInitialized(true);
    decrement();
  }

  return type === CounterType.SMART
    ? <div className="justify-center h-full transition-all flex bg-pink-500 rounded-md text-amber-50" onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
      <button type="button" className="w-[40px]" onClick={decr}>
        <div className="hover:scale-125 duration-150">-</div>
      </button>
      <input
        className="w-[40px] text-center pointer-events-none bg-pink-500"
        type="number"
        min={1}
        value={count}
      />
      <button type="button" className="w-[40px]" onClick={incr}>
        <div className="hover:scale-125 duration-150">+</div>
      </button>
    </div>
    : <div className="flex">
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={decr}
      >-</Button>
      <input
        className="w-[40px] mx-2 rounded-md text-center pointer-events-none"
        type="number"
        min={1}
        value={count}
      />
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={incr}
      >+</Button>
    </div>;
}