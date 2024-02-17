'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { convertToClass } from '@/utils/convert-to-class.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAppDispatch } from '@/store/store';
import { MouseEvent, useMemo } from 'react';
import { addProductToCart } from '@/store/dataSlice';

export interface EntityCardProps {
  config: IConfig;
  category?: ICategory;
  product?: IProduct;
}

export function EntityCard({category, product, config}: EntityCardProps) {
  const cardClass = useMemo(() => convertToClass([
    product ? 'h-96' : '',
    'flex',
    'flex-col',
    'items-center',
    'justify-between',
    'rounded-lg',
    'p-4',
    'border-2 border-pink-200',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors',
  ]), []);
  const titleClass = useMemo(() => convertToClass([
    product ? 'text-base' : 'text-lg',
    product ? 'min-h-19' : 'min-h-6',
    'h-full',
    'flex',
    'justify-center',
    'items-center',
    'text-center',
    'text-sm',
    'md:text-base',
    'mt-2',
    'entity-card-title',
  ]), []);

  const dispatch = useAppDispatch();

  const addToCart = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (product) {
      dispatch(addProductToCart({
        data: product,
        amount: 1,
        addToExist: true,
      }));
    }
  }

  const getPageLink = (): string => {
    return category?.id
      ? `${RouterPath.CATEGORIES}/${category.id}`
      : `${RouterPath.CATEGORIES}/${product?.categoryId}${RouterPath.PRODUCTS}/${product?.id}`;
  };

  return (
    <Link
      className={cardClass}
      href={getPageLink()}
    >
      <Image
        className="rounded-md bg-amber-50"
        width={200}
        height={200}
        src={category?.imageUrl || product?.imageUrls?.[0] || ''}
        alt={category?.title || product?.title || ''}
      />
      <h3 className={titleClass}>{category?.title || product?.title}</h3>
      {
        product
          ? (
            <>
              <div className="text-pink-500 bold my-2">{product.price} {config.currency}</div>
              <Button
                styleClass="text-amber-50 w-full px-4 py-2"
                type={ButtonType.BUTTON}
                callback={addToCart}
              >{TRANSLATES[LOCALE].intoCart}</Button>
            </>
          )
          : <></>
      }
    </Link>
  );
}