import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useCallback, useEffect, useMemo } from 'react';
import { setCartData } from '@/store/dataSlice';
import { ICart, IProduct } from '@/app/models';
import { RouterPath } from '@/app/enums';

interface ICartProps {
  firestoreProductsData?: IProduct[];
}

export function CartButton({firestoreProductsData}: ICartProps) {
  const dispatch = useAppDispatch();
  const cartData = useAppSelector(state => state.dataReducer.cart);

  useEffect(() => {
    const localStorageCartData = localStorage.getItem('cart');
    if (localStorageCartData) {
      const oldCart: ICart = JSON.parse(localStorageCartData as string) as ICart;
      const updatedCart: ICart = {
        totalProductsPrice: 0,
        totalProductsAmount: 0,
        products: {}
      };

      firestoreProductsData?.forEach((product: IProduct) => {
        if (oldCart.products?.[product.id]) {
          updatedCart.products[product.id] = {
            data: product,
            amount: oldCart.products[product.id].amount
          };
          updatedCart.totalProductsPrice += (oldCart.products[product.id].amount * product.price);
          updatedCart.totalProductsAmount += 1;
        }
      });
      dispatch(setCartData(updatedCart));
    }
  }, []);

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

  const counterClass: string = useMemo(() => convertToClass([
    'absolute',
    'text-white',
    'text-xs',
    'text-center',
    'bg-pink-500 ',
    'rounded-full',
    'top-[4px]',
    'right-[6px]',
    'flex',
    'items-center',
    'justify-center',
    'size-6',
  ]), [cartData.totalProductsAmount]);

  return (
    <Link href={RouterPath.CART} className={linkClass}>
      <Image className="p-2" width={45} height={45} src="/icons/cart.svg" alt="CartButton"/>
      {
        cartData.totalProductsAmount
          ? <div className={counterClass}>
            {cartData.totalProductsAmount}
          </div>
          : <></>
      }
    </Link>
  );
}