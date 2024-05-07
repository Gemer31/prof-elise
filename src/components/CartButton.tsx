import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useMemo } from 'react';
import { IProduct } from '@/app/models';
import { RouterPath } from '@/app/enums';
import { CartCounter } from '@/components/CartCounter';

interface ICartProps {
  firestoreProductsData?: IProduct[];
}

export function CartButton({firestoreProductsData}: ICartProps) {
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
    <Link href={RouterPath.CART} className={linkClass}>
      <Image className="p-2" width={45} height={45} src="/icons/cart.svg" alt="CartButton"/>
      <CartCounter firestoreProductsData={firestoreProductsData}/>
    </Link>
  );
}