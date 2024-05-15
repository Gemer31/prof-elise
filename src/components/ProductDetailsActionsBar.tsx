'use client';

import { Counter } from '@/components/Counter';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { useRouter } from 'next/navigation';

interface IProductDetailsActionsBarProps {
  productId: string;
}

export function ProductDetailsActionsBar({productId}: IProductDetailsActionsBarProps) {
  const router = useRouter();
  // @ts-ignore
  const cartCount = useAppSelector(state => state.dataReducer.client?.cart?.[productId]?.count);
  const dispatch = useAppDispatch();

  return <div className="flex gap-x-2 items-center w-fit">
    {
      cartCount
        ? <Button
          styleClass="text-white py-2 px-4"
          type={ButtonTypes.BUTTON}
          callback={() => router.push(RouterPath.CART)}
        >
          <div className="w-max">{TRANSLATES[LOCALE].alreadyInCart}</div>
          <span className="text-xs">{TRANSLATES[LOCALE].goto}</span>
        </Button>
        : <></>
    }
    <Counter productId={productId}/>
    <Button
      styleClass="text-white w-full py-2 px-4"
      type={ButtonTypes.BUTTON}
      callback={() => dispatch(setRequestCallPopupVisible(true))}
    >{TRANSLATES[LOCALE].buyInOneClick}</Button>
  </div>;
}