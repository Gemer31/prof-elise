'use client';

import { MouseEvent, useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ICartProductModel, IClient } from '@/store/dataSlice';
import { ButtonType, CounterType, FirebaseCollections, RouterPath } from '@/app/enums';
import Link from 'next/link';
import Image from 'next/image';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig, IProduct } from '@/app/models';
import { Loader } from '@/components/Loader';
import './product-card.css';
import { updateClient } from '@/store/asyncThunk';
import { doc, DocumentReference } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { CLIENT_ID } from '@/app/constants';

export interface IProductCardProps {
  config: IConfig;
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function ProductCard({data, config, isLoading, onClick}: IProductCardProps) {
  const cardClass = useMemo(() => convertToClass([
    'product-card',
    'h-96',
    'p-4',
    'rounded-lg',
    'border-2 border-pink-200',
    'hover:bg-pink-100'
  ]), []);
  const titleClass = useMemo(() => convertToClass([
    'text-base',
    'min-h-16',
    'h-full',
    'flex',
    'justify-center',
    'items-center',
    'text-center',
    'text-sm',
    'md:text-base',
    'mt-2',
    'entity-card-title'
  ]), []);

  const clientId = useMemo(() => localStorage.getItem(CLIENT_ID), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const counter = useAppSelector(state => state.dataReducer.client?.cart?.[data.id]?.count);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);
  // @ts-ignore
  const isFavourite = useAppSelector(state => state.dataReducer.client?.['favourites']?.[data.id]);

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
        productRef: doc(db, FirebaseCollections.PRODUCTS, data.id)
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

  const favouriteClick = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const newFavourites = {...client.favourites} as Record<string, DocumentReference>;

    if (isFavourite) {
      delete newFavourites[data.id];
    } else {
      newFavourites[data.id] = doc(db, FirebaseCollections.PRODUCTS, data.id);
    }

    const clientId: string = localStorage.getItem(CLIENT_ID) as string;
    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        favourites: newFavourites
      }
    }));
  };

  return (
    <Link
      className={cardClass + (isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data?.categoryId}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <div className="product-card-favourite-button hover:scale-110" onClick={favouriteClick}>
        {
          isFavourite
            ? <Image width={25} height={25} src="/icons/heart-filled.svg" alt="favourite"/>
            : <Image width={25} height={25} src="/icons/heart.svg" alt="favourite"/>
        }
      </div>
      <Image
        className="rounded-md h-[200px] w-[200px]"
        width={200}
        height={200}
        src={data?.imageUrls?.[0] || ''}
        alt={data?.title || ''}
      />
      <h3 className={titleClass}>{data?.title}</h3>
      <div className="text-pink-500 bold my-2">{data.price} {config.currency}</div>
      <div className="flex gap-1 w-full">
        <div className="w-1/2 h-full flex justify-center items-center">
          {
            cartLoading
              ? <Loader styleClass="h-[25px] border-pink-500"/>
              : counter
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
          }
        </div>
        <Button
          styleClass="text-amber-50 w-1/2 px-4 py-2"
          type={ButtonType.BUTTON}
        >{TRANSLATES[LOCALE].preview}</Button>
      </div>
      {
        isLoading
          ? <div className="w-full h-full absolute top-0 flex justify-center items-center bg-black-1/5">
            <Loader styleClass="h-[50px] border-pink-500"/>
          </div>
          : <></>
      }
    </Link>
  );
}