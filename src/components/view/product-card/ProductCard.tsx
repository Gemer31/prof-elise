'use client';

import { useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ButtonTypes, RouterPath } from '@/app/enums';
import Link from 'next/link';
import Image from 'next/image';
import { Counter } from '@/components/view/Counter';
import { Button } from '@/components/ui/Button';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig, IProductSerialized } from '@/app/models';
import { Loader } from '@/components/ui/Loader';
import './product-card.css';
import { EntityFavouriteButton } from '@/components/view/EntityFavouriteButton';
import { COLOR_OPTION_VALUES } from '@/app/constants';
import currency from 'currency.js';

export interface IProductCardProps {
  config: IConfig;
  data: IProductSerialized;
  isLoading?: boolean,
  onClick?: () => void,
}

export function ProductCard({data, config, isLoading, onClick}: IProductCardProps) {
  const hostClass = useMemo(() => convertToClass([
    'product-card',
    'h-96',
    'p-4',
    'rounded-lg',
    'border-2 border-pink-200',
    'hover:bg-pink-100',
    isLoading ? ' pointer-events-none' : ''
  ]), [isLoading]);
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

  return (
    <Link
      className={hostClass}
      href={`${RouterPath.CATEGORIES}/${data?.categoryRef}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <div className="absolute flex flex-col gap-y-2 left-4 top-4">
        {
          data.labels?.map((item, index) => {
            return <div
              key={index}
              className={'pointer-events-none w-fit px-2 py-1 rounded-md text-xs ' + COLOR_OPTION_VALUES.get(item.color)}
            >{item.text}</div>;
          })
        }
      </div>
      <EntityFavouriteButton className="product-card-favourite-button absolute scale-0 top-4 right-4" productId={data.id}/>
      <Image
        className="rounded-md h-[200px] w-[200px]"
        width={200}
        height={200}
        src={data?.imageUrls?.[0] || ''}
        alt={data?.title || ''}
      />
      <h3 className={titleClass}>{data?.title}</h3>
      <div className="text-pink-500 bold my-2">{currency(data.price).toString()} {config.currency}</div>
      <div className="flex gap-1 w-full">
        <div className="w-1/2 h-full flex justify-center items-center">
          <Counter productId={data.id}/>
        </div>
        <Button
          styleClass="text-amber-50 w-1/2 px-4 py-2"
          type={ButtonTypes.BUTTON}
        >{TRANSLATES[LOCALE].preview}</Button>
      </div>
      {
        isLoading
          ? <div className="w-full h-full absolute top-0 flex justify-center items-center bg-black-1/5">
            <Loader className="h-[50px] border-pink-500"/>
          </div>
          : <></>
      }
    </Link>
  );
}