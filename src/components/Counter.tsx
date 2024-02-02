'use client';

import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useEffect, useState } from 'react';

interface Counter {
  selectedAmount?: number;
  counterChangedCallback: (amount: number) => void;
}

export function Counter({ counterChangedCallback, selectedAmount }: Counter) {
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (selectedAmount) {
      setAmount(selectedAmount);
    }
  }, [selectedAmount]);

  const changeCounter = (operator: '+' | '-') => {
    const newAmount: number = operator === '-'
      ? (amount === 1 ? 1 : amount - 1)
      : amount + 1
    setAmount(newAmount);
    counterChangedCallback(newAmount);
  }

  return (
    <div className="flex">
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={() => changeCounter('-')}
      >-</Button>
      <input
        className="w-[40px] mx-2 rounded-md text-center pointer-events-none"
        type="number"
        min={1}
        value={amount}
      />
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={() => changeCounter('+')}
      >+</Button>
    </div>
  )
}