'use client'

import { IClient, IConfig } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { getEnrichedCart } from '@/utils/firebase.util';

interface ICartListTotalBarProps {
  config: IConfig;
}

export function CartListTotalBar({config}: ICartListTotalBarProps) {
  const [total, setTotal] = useState(0);
  const client: IClient = useAppSelector(state => state.dataReducer.client);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);

  useEffect(() => {
    getEnrichedCart(client.cart).then(enrichedCart => {
      let newTotal: number = 0;
      Object.values(enrichedCart).forEach(item => {
        newTotal += (+item.productRef.price * item.count);
      });
      setTotal(newTotal);
    })
  }, [client]);

  return <section className="sticky top-20 h-fit bg-slate-100 rounded-md">
    <div className="w-full p-4 separator">
      <Button
        // disabled={cartLoading || total === 0}
        styleClass="w-full"
        type={ButtonTypes.BUTTON}
      >
        <Link className="flex py-2" href={RouterPath.CHECKOUT}>
          {TRANSLATES[LOCALE].gotoCreateOrder}
        </Link>
      </Button>
      <div className="py-2 text-center text-xs">{TRANSLATES[LOCALE].createOrderHint}</div>
    </div>
    <div className="flex justify-between p-4 text-lg">
      <span>{TRANSLATES[LOCALE].result}:</span>
      {
        cartLoading
          ? <Loader className="size-4 border-pink-500"></Loader>
          : <span className="font-bold">{total} {config.currency}</span>
      }
    </div>
  </section>
}