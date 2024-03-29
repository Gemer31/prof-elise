'use client';

import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useEffect } from 'react';
import { useCounter } from '@uidotdev/usehooks';

interface Counter {
  selectedAmount?: number;
  counterChangedCallback: (amount: number) => void;
}

export function Counter({counterChangedCallback, selectedAmount}: Counter) {
  const [count, {increment, decrement, set}] = useCounter(1, {min: 1});

  useEffect(() => {
    selectedAmount && set(selectedAmount);
  }, []);

  useEffect(() => {
    counterChangedCallback(count);
  }, [count]);

  return (
    <div className="flex">
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
  );
}