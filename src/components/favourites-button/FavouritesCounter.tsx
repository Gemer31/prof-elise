'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';

export function FavouritesCounter() {
  const dispatch = useAppDispatch();
  // @ts-ignore
  const favourites = useAppSelector(state => state.dataReducer.client?.['favourites']);
  const [counterAnimationClass, setCounterAnimationClass] = useState<string>('');
  const [numbersAnimationClass, setNumbersAnimationClass] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number>();
  const [currentValue, setCurrentValue] = useState<number>();
  const [nextValue, setNextValue] = useState<number>();

  useEffect(() => {
    const oldValue = Number(currentValue);
    const favouritesCount = favourites ? Object.keys(favourites)?.length : null;

    if (oldValue && !favouritesCount) {
      setCounterAnimationClass('cart-counter-disappear');
      setTimeout(() => {
        setCurrentValue(favouritesCount);
      }, 150);
    } else if (!oldValue && favouritesCount) {
      setCounterAnimationClass('cart-counter-appear');
      setCurrentValue(favouritesCount);
    } else if (favouritesCount > oldValue) {
      setNextValue(favouritesCount);
      setNumbersAnimationClass('cart-counter-slide-up');
      setTimeout(() => {
        setNextValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(favouritesCount);
      }, 150);
    } else if (favouritesCount < oldValue) {
      setPrevValue(favouritesCount);
      setNumbersAnimationClass('cart-counter-slide-down');
      setTimeout(() => {
        setPrevValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(favouritesCount);
      }, 150);
    }
  }, [favourites]);
  return <div className={'cart-counter ' + counterAnimationClass}>
    <div className={'cart-counter-numbers ' + numbersAnimationClass}>
      {nextValue ? <div>{nextValue}</div> : <></>}
      <div>{currentValue}</div>
      {prevValue ? <div>{prevValue}</div> : <></>}
    </div>
  </div>;
}