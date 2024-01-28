'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { Category, Product } from '@/app/models';
import { convertToClass } from '@/utils/convert-to-class.util';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface EntityCardProps {
  category?: Category;
  product?: Product;
}
export function EntityCard({ category, product }: EntityCardProps) {

  const cardClass = convertToClass([
    'flex',
    'flex-col',
    'items-center',
    'items-center',
    'rounded-lg',
    'p-4',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors',
  ]);

  const addToCart = () => {

  }

  return (
    <Link
      className={cardClass}
      href={category?.id ? `/${category.id}` : `/products/${product?.id}`}
    >
      <Image width={200} height={200} src={category?.image || product?.image || ''} alt={category?.name || product?.name || ''}/>
      <div className={product ? 'text-base' : 'text-lg'}>{category?.name || product?.name}</div>
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
  )
}