'use client';

import { Counter } from '@/components/view/Counter';
import { ButtonTypes, PopupTypes, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setPopupData } from '@/store/dataSlice';
import { IProductSerialized } from '@/app/models';

interface IProductDetailsActionsBarProps {
  product: IProductSerialized;
}

export function ProductDetailsActionsBar({product}: IProductDetailsActionsBarProps) {
  const cartCount = useAppSelector(state => state.dataReducer.client?.cart?.[product?.id]?.count);
  const dispatch = useAppDispatch();

  return <div className="flex gap-x-2 items-center">
    {
      cartCount
        ? <Button
          styleClass="text-white w-full py-2 px-4"
          type={ButtonTypes.BUTTON}
          href={RouterPath.CART}
        >{TRANSLATES[LOCALE].alreadyInCart}</Button>
        : <></>
    }
    <Counter productId={product?.id}/>
    <Button
      styleClass="text-white w-full py-2 px-4"
      type={ButtonTypes.BUTTON}
      callback={() => dispatch(setPopupData({
        formType: PopupTypes.BUY_IN_ONE_CLICK,
        product
      }))}
    >{TRANSLATES[LOCALE].buyInOneClick}</Button>
  </div>;
}