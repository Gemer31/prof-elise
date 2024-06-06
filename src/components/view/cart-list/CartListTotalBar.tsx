'use client';

import { IClient, IConfig } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/Loader';
import { getEnrichedCart } from '@/utils/firebase.util';
import currency from 'currency.js';

interface ICartListTotalBarProps {
  config: IConfig;
}

export function CartListTotalBar({config}: ICartListTotalBarProps) {
  const [total, setTotal] = useState<string>('0');
  const [redirectLoading, setRedirectLoading] = useState(false);
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    getEnrichedCart(client?.cart).then(enrichedCart => {
      let newTotal: string = '0';
      Object.values(enrichedCart).forEach(item => {
        newTotal = currency(newTotal).add((+item.productRef.price * item.count)).toString();
      });
      setTotal(newTotal);
    });
  }, [client]);

  return <section className="w-3/12 mb-2 sticky top-20 h-fit bg-slate-100 rounded-md">
    <div className="w-full p-4 separator">
      <Button
        disabled={!total || redirectLoading}
        loading={redirectLoading}
        styleClass={'w-full py-2'}
        type={ButtonTypes.BUTTON}
        href={RouterPath.CHECKOUT}
        callback={() => setRedirectLoading(true)}
      >{TRANSLATES[LOCALE].gotoCreateOrder}</Button>
      <div className="py-2 text-center text-xs">{TRANSLATES[LOCALE].createOrderHint}</div>
    </div>
    <div className="flex justify-between items-center p-4 text-lg">
      <span>{TRANSLATES[LOCALE].result}:</span>
      {
        !total
          ? <Loader className="size-6 border-pink-500"></Loader>
          : <span className="font-bold">{total} {config.currency}</span>
      }
    </div>
  </section>;
}