'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { convertToClass } from '@/utils/convert-to-class.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAppDispatch } from '@/store/store';
import { MouseEvent } from 'react';
import { addProductToCart } from '@/store/dataSlice';

export interface EntityCardProps {
  config: IConfig;
  category?: ICategory;
  product?: IProduct;
}

export function EntityCard({category, product, config}: EntityCardProps) {
  const cardClass = convertToClass([
    product ? 'h-96' : 'h-72',
    'flex',
    'flex-col',
    'items-center',
    'justify-between',
    'rounded-lg',
    'p-4',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]);

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
        className="rounded-md"
        width={200}
        height={200}
        src={category?.imageUrl || product?.imageUrls?.[0] || ''}
        alt={category?.title || product?.title || ''}
      />
      <div className={`text-center mt-2 ${product ? 'text-base' : 'text-lg'}`}>{category?.title || product?.title}</div>
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