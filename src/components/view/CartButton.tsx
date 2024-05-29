'use client';

import Image from 'next/image';
import { RouterPath } from '@/app/enums';
import { HeaderCounter } from '@/components/ui/header-counter/HeaderCounter';
import { useAppSelector } from '@/store/store';
import { CircleButton } from '@/components/ui/CircleButton';

export function CartButton() {
  const cartTotal = useAppSelector(state => state.dataReducer.cartTotal);
  return <CircleButton styleClass="size-14 relative" href={RouterPath.CART}>
    <Image className="p-2" width={45} height={45} src="/icons/cart.svg" alt="CartButton"/>
    <HeaderCounter value={cartTotal}/>
  </CircleButton>;
}