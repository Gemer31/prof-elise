'use client';

import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RouterPath } from '@/app/enums';
import { HeaderCounter } from '@/components/header-counter/HeaderCounter';
import { useAppSelector } from '@/store/store';

export function FavouritesButton() {
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

  // @ts-ignore
  const favourites = useAppSelector(state => state.dataReducer.client?.['favourites']);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const newCount = favourites && (Object.keys(favourites).length || 0);
    setCounter(newCount);
  }, [favourites]);

  return (
    <Link href={RouterPath.FAVOURITES} className={hostClass}>
      <Image className="p-2" width={45} height={45} src="/icons/heart.svg" alt="CartButton"/>
      <HeaderCounter value={counter}/>
    </Link>
  );
}