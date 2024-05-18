'use client';

import { IClient, IConfig } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { getEnrichedCart } from '@/utils/firebase.util';

interface ICheckoutTotalBarProps {
  config: IConfig;
  isLoading: boolean;
  onSubmit: () => void;
}

export function CheckoutTotalBar({config, isLoading, onSubmit}: ICheckoutTotalBarProps) {
  const [total, setTotal] = useState<number>(0);
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    getEnrichedCart(client?.cart).then(enrichedCart => {
      let newTotal: number = 0;
      Object.values(enrichedCart).forEach(item => {
        newTotal += (+item.productRef.price * item.count);
      });
      setTotal(newTotal);
    })
  }, [client]);

  return <section className="w-4/12 mb-4 sticky top-20 h-fit bg-slate-100 rounded-md">
    <div className="w-full px-4 pt-4 after:py-2 separator">
      <Button
        disabled={!total || isLoading}
        loading={isLoading}
        styleClass={'w-full py-2 px-4'}
        type={ButtonTypes.SUBMIT}
        callback={() => onSubmit()}
      >{TRANSLATES[LOCALE].createOrder}</Button>
    </div>
    <div className="flex justify-between items-center p-4 text-lg">
      <span>{TRANSLATES[LOCALE].result}:</span>
      {
        !total
          ? <Loader className="size-6 border-pink-500"></Loader>
          : <span className="font-bold">{total} {config.currency}</span>
      }
    </div>
  </section>
}