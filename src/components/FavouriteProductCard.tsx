'use client';

import { IProduct } from '@/app/models';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { ButtonType, CounterType, FirestoreCollections, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { MouseEvent, useMemo, useState } from 'react';
import { ICartProductModel, IClient } from '@/store/dataSlice';
import { doc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { updateClient } from '@/store/asyncThunk';
import { CLIENT_ID } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Counter } from '@/components/Counter';
import Link from 'next/link';

export interface IFavouriteProductCardProps {
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function FavouriteProductCard({data, isLoading, onClick}: IFavouriteProductCardProps) {
  const clientId = useMemo(() => localStorage.getItem(CLIENT_ID), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const counter = useAppSelector(state => state.dataReducer.client?.cart?.[data.id]?.count);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  const addToCart = (event?: MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();

    const newCart: Record<string, ICartProductModel> = {};
    Object.keys(client.cart).forEach((item) => {
      newCart[item] = {...client.cart[item]};
    });

    if (newCart[data.id]) {
      newCart[data.id].count += 1;
    } else {
      newCart[data.id] = {
        count: 1,
        productRef: doc(db, FirestoreCollections.PRODUCTS, data.id)
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

    newCart[data.id].count -= 1;
    newCart[data.id].count === 0 && delete newCart[data.id];

    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: newCart
      }
    }));
  };

  return <div className="grid grid-cols-3">
    <Link
      className={(isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data.categoryRef.path.at(-1)}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <Image width={150} height={150} src={data.imageUrls[0]} alt={data.title}/>
      <span>{data.title}</span>
    </Link>
    <span>{data.price}</span>
    <div>
      counter
      ?
      <Counter
        type={CounterType.SMART}
        selectedAmount={counter}
        counterChangedCallback={(newCount) => {
          if (newCount > counter) {
            addToCart();
          } else {
            removeFromCart();
          }
        }}/>
      : <Button
      styleClass="text-amber-50 w-full px-4 py-2 text-nowrap"
      type={ButtonType.BUTTON}
      callback={(e) => addToCart(e)}
    >{TRANSLATES[LOCALE].intoCart}</Button>
    </div>
  </div>;
}