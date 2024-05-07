'use client';

import { Button } from '@/components/Button';
import { ButtonType, CounterType } from '@/app/enums';
import { useEffect } from 'react';
import { useCounter } from '@uidotdev/usehooks';

interface ICounterProps {
  type?: CounterType;
  selectedAmount?: number;
  counterChangedCallback: (amount: number) => void;
}

export function Counter({type, counterChangedCallback, selectedAmount}: ICounterProps) {
  const [count, {increment, decrement, set}] = useCounter(1, {min: 1});

  useEffect(() => {
    selectedAmount && set(selectedAmount);
  }, []);

  useEffect(() => {
    counterChangedCallback(count);
  }, [count]);

  return type === CounterType.SMART
    ? <div className="flex bg-pink-500 rounded-md text-amber-50">
      <button type="button" className="w-[40px]" onClick={decrement}>
        <div className="hover:scale-105">-</div>
      </button>
      <input
        className="w-[40px] text-center pointer-events-none bg-pink-500"
        type="number"
        min={1}
        value={count}
      />
      <button type="button" className="w-[40px]" onClick={increment}>
        <div className="hover:scale-105">+</div>
      </button>
    </div>
    : <div className="flex">
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={decrement}
      >-</Button>
      <input
        className="w-[40px] mx-2 rounded-md text-center pointer-events-none"
        type="number"
        min={1}
        value={count}
      />
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={increment}
      >+</Button>
    </div>
}