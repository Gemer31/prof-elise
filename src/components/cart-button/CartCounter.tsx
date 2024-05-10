'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';

export function CartCounter() {
  const dispatch = useAppDispatch();
  // const cartData = useAppSelector(state => state.dataReducer.cart);
  // @ts-ignore
  const cartData = useAppSelector(state => state.dataReducer.client['cart']);
  const cartTotal = useAppSelector(state => state.dataReducer.cartTotal);
  const [counterAnimationClass, setCounterAnimationClass] = useState<string>('');
  const [numbersAnimationClass, setNumbersAnimationClass] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number>();
  const [currentValue, setCurrentValue] = useState<number>();
  const [nextValue, setNextValue] = useState<number>();

  useEffect(() => {
    const oldValue = Number(currentValue);

    if (oldValue && !cartTotal) {
      setCounterAnimationClass('cart-counter-disappear');
      setTimeout(() => {
        setCurrentValue(cartTotal);
      }, 150);
    } else if (!oldValue && cartTotal) {
      setCounterAnimationClass('cart-counter-appear');
      setCurrentValue(cartTotal);
    }
    else if (cartTotal > oldValue) {
      setNextValue(cartTotal);
      setNumbersAnimationClass('cart-counter-slide-up');
      setTimeout(() => {
        setNextValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(cartTotal);
      }, 150);
    } else if (cartTotal < oldValue) {
      setPrevValue(cartTotal);
      setNumbersAnimationClass('cart-counter-slide-down');
      setTimeout(() => {
        setPrevValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(cartTotal);
      }, 150);
    }
  }, [cartTotal]);

  return <div className={'cart-counter ' + counterAnimationClass}>
    <div className={'cart-counter-numbers ' + numbersAnimationClass}>
      {nextValue ? <div>{nextValue}</div> : <></>}
      <div>{currentValue}</div>
      {prevValue ? <div>{prevValue}</div> : <></>}
    </div>
  </div>
}