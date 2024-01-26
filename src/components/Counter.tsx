'use client'

import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useState } from 'react';

export function Counter() {
  const [amount, setAmount] = useState(1);

  return (
    <div className="flex">
      <Button
        styleClass="text-amber-50 px-4 py-4 leading-3"
        type={ButtonType.BUTTON}
        callback={() => {
          setAmount((prev) => prev === 1 ? 1 : prev - 1)
        }}
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
        callback={() => {
          setAmount((prev) => prev + 1)
        }}
      >+</Button>
    </div>
  )
}