import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';

export function Cart() {
  const cartAmount = 12;

  const linkClass: string = convertToClass([
    'relative',
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-amber-50',
    'm-1',
    'size-12',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]);

  return (
    <Link href="/cart" className={linkClass}>
      <Image className="p-2" width={40} height={40} src="/icons/cart.svg" alt="Cart"/>
      <div className="absolute text-white text-xs bg-pink-500 rounded-full top-[4px] right-[4px] p-1">{cartAmount}</div>
    </Link>
  );
}