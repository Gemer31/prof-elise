'use client';

import { MouseEvent, useMemo, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addProductToCart } from '@/store/dataSlice';
import { ButtonType, CounterType, RouterPath } from '@/app/enums';
import Link from 'next/link';
import Image from 'next/image';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig, IProduct } from '@/app/models';
import { Loader } from '@/components/Loader';

export interface IProductCardProps {
  config: IConfig;
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function ProductCard({data, config, isLoading, onClick}: IProductCardProps) {
  const cardClass = useMemo(() => convertToClass([
    'relative',
    'h-96',
    'flex',
    'flex-col',
    'items-center',
    'justify-between',
    'rounded-lg',
    'p-4',
    'border-2 border-pink-200',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
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

  const dispatch = useAppDispatch();
  // @ts-ignore
  const counter = useAppSelector(state => state.dataReducer.cart.products?.[data.id]?.amount);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);

  const addToCart = (event?: MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();

    dispatch(addProductToCart({
      data,
      addToExist: true,
      amount: counter ? counter + 1 : 1,
    }));
  };

  const removeFromCart = () => {
    dispatch(addProductToCart({
      data,
      addToExist: false,
      amount: counter - 1
    }));
  };

  return (
    <Link
      className={cardClass + (isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data?.categoryId}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
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