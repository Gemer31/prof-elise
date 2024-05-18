'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RouterPath } from '@/app/enums';
import { HeaderCounter } from '@/components/header-counter/HeaderCounter';
import { useAppSelector } from '@/store/store';
import { CircleButton } from '@/components/CircleButton';

export function FavouritesButton() {
  const favourites = useAppSelector(state => state.dataReducer.client?.['favourites']);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const newCount = favourites && (Object.keys(favourites).length || 0);
    setCounter(newCount);
  }, [favourites]);

  return <CircleButton styleClass="size-14 relative" href={RouterPath.FAVOURITES}>
    <Image className="p-2" width={45} height={45} src="/icons/heart.svg" alt="CartButton"/>
    <HeaderCounter value={counter}/>
  </CircleButton>;
}