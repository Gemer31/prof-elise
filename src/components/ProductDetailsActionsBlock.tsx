'use client'

import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAppDispatch } from '@/store/store';
import { Product } from '@/app/models';
import { addProductToCart } from '@/store/dataSlice';
import { useState } from 'react';

interface ProductDetailsActionsBlockProps {
  product: Product | undefined;
}

export function ProductDetailsActionsBlock({ product }: ProductDetailsActionsBlockProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>();
  const [amount, setAmount] = useState(1);

  const addToCart = () => {
    if (product) {
      setLoading(true);
      dispatch(addProductToCart({
        data: product,
        amount,
        addToExist: true,
      }));
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-between items-center my-4">
      <Counter counterChangedCallback={setAmount}/>
      <Button
        styleClass="uppercase text-amber-50 px-4 py-2"
        type={ButtonType.BUTTON}
        loading={loading}
        disabled={loading}
        callback={addToCart}
      >{TRANSLATES[LOCALE].intoCart}</Button>
    </div>
  )
}