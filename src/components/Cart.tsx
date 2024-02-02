import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { setCartData } from '@/store/dataSlice';

export function Cart() {
  const dispatch = useAppDispatch();
  const cartData = useAppSelector(state => state.dataReducer.cart);

  useEffect(() => {
    const localStorageCartData = localStorage.getItem('cart');
    if (localStorageCartData) {
      dispatch(setCartData(
        JSON.parse(localStorageCartData),
      ));
    }
  }, []);


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
      {
        cartData.totalProductsAmount
          ? <div className="absolute text-white text-xs bg-pink-500 rounded-full top-[4px] right-[4px] p-1">
            {cartData.totalProductsAmount}
          </div>
          : <></>
      }
    </Link>
  );
}