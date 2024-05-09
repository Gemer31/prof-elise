'use client';

import { useEffect, useState } from 'react';
import { ICart, IProduct } from '@/app/models';
import { setCartData } from '@/store/dataSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';

interface ICartCounterProps {
  firestoreProductsData?: IProduct[];
}

export function CartCounter({firestoreProductsData}: ICartCounterProps) {
  const dispatch = useAppDispatch();
  const cartData = useAppSelector(state => state.dataReducer.cart);
  const [counterAnimationClass, setCounterAnimationClass] = useState<string>('');
  const [numbersAnimationClass, setNumbersAnimationClass] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number>();
  const [currentValue, setCurrentValue] = useState<number>();
  const [nextValue, setNextValue] = useState<number>();

  useEffect(() => {
    const localStorageCartData = localStorage.getItem('cart');
    if (localStorageCartData) {
      const oldCart: ICart = JSON.parse(localStorageCartData as string) as ICart;
      const updatedCart: ICart = {
        totalProductsPrice: '0',
        totalProductsAmount: 0,
        products: {}
      };

      firestoreProductsData?.forEach((product: IProduct) => {
        if (oldCart.products?.[product.id]) {
          const amount = oldCart.products[product.id].amount;
          updatedCart.products[product.id] = {
            data: product,
            amount
          };
          updatedCart.totalProductsPrice = parseFloat(updatedCart.totalProductsPrice) + (oldCart.products[product.id].amount * parseFloat(product.price)).toFixed(2);
          updatedCart.totalProductsAmount += amount;
        }
      });
      dispatch(setCartData(updatedCart));
    } else {
      dispatch(setCartData({
        totalProductsPrice: '0',
        totalProductsAmount: 0,
        products: {}
      }));
    }
  }, []);

  useEffect(() => {
    const oldValue = Number(currentValue);

    if (oldValue && !cartData.totalProductsAmount) {
      setCounterAnimationClass('cart-counter-disappear');
      setTimeout(() => {
        setCurrentValue(cartData.totalProductsAmount);
      }, 150);
    } else if (!oldValue && cartData.totalProductsAmount) {
      setCounterAnimationClass('cart-counter-appear');
      setCurrentValue(cartData.totalProductsAmount);
    }
    else if (cartData.totalProductsAmount > oldValue) {
      setNextValue(cartData.totalProductsAmount);
      setNumbersAnimationClass('cart-counter-slide-up');
      setTimeout(() => {
        setNextValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(cartData.totalProductsAmount);
      }, 150);
    } else if (cartData.totalProductsAmount < oldValue) {
      setPrevValue(cartData.totalProductsAmount);
      setNumbersAnimationClass('cart-counter-slide-down');
      setTimeout(() => {
        setPrevValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(cartData.totalProductsAmount);
      }, 150);
    }
  }, [cartData.totalProductsAmount]);
  return <div className={'cart-counter ' + counterAnimationClass}>
    <div className={'cart-counter-numbers ' + numbersAnimationClass}>
      {nextValue ? <div>{nextValue}</div> : <></>}
      <div>{currentValue}</div>
      {prevValue ? <div>{prevValue}</div> : <></>}
    </div>
  </div>
}