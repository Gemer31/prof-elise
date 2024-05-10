import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useMemo } from 'react';
import { IProduct } from '@/app/models';
import { RouterPath } from '@/app/enums';
import { CartCounter } from '@/components/cart-button/CartCounter';
import { FavouritesCounter } from '@/components/favourites-button/FavouritesCounter';

export function FavouritesButton() {
  const linkClass: string = useMemo(() => convertToClass([
    'relative',
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-amber-50',
    'm-1',
    'size-14',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]), []);

  return (
    <Link href={RouterPath.FAVOURITES} className={linkClass}>
      <Image className="p-2" width={45} height={45} src="/icons/heart.svg" alt="CartButton"/>
      <FavouritesCounter/>
    </Link>
  );
}