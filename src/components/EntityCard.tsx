'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { Category, Product } from '@/app/models';
import { convertToClass } from '@/utils/convert-to-class.util';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface EntityCardProps {
  category?: Category;
  product?: Product;
}

export function EntityCard({category, product}: EntityCardProps) {

  const cardClass = convertToClass([
    'flex',
    'flex-col',
    'items-center',
    'items-center',
    'rounded-lg',
    'p-4',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]);

  const addToCart = () => {

  };

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
        width={200}
        height={200}
        src={category?.imageUrl || product?.imageUrls?.[0] || ''}
        alt={category?.title || product?.title || ''}
      />
      <div className={product ? 'text-base' : 'text-lg'}>{category?.title || product?.title}</div>
      {
        product
          ? (
            <>
              <div className="text-pink-500 bold py-2">{product.price} бел.руб.</div>
              <Button
                styleClass="text-amber-50 w-full px-4 py-2"
                type={ButtonType.BUTTON}
                callback={() => addToCart()}
              >{TRANSLATES[LOCALE].intoCart}</Button>
            </>
          )
          : <></>
      }
    </Link>
  );
}