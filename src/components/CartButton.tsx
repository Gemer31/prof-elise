'use client';

import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useMemo } from 'react';
import { RouterPath } from '@/app/enums';
import { HeaderCounter } from '@/components/header-counter/HeaderCounter';
import { useAppSelector } from '@/store/store';

export function CartButton() {
  const hostClass: string = useMemo(() => convertToClass([
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

  const cartTotal = useAppSelector(state => state.dataReducer.cartTotal);

  return (
    <Link href={RouterPath.CART} className={hostClass}>
      <Image className="p-2" width={45} height={45} src="/icons/cart.svg" alt="CartButton"/>
      <HeaderCounter value={cartTotal}/>
    </Link>
  );
}