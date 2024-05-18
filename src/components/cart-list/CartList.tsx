'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { CartListTotalBar } from '@/components/cart-list/CartListTotalBar';
import { useEffect, useState } from 'react';
import { IClient, IClientEnriched, IConfig } from '@/app/models';
import { getClientId } from '@/utils/cookies.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CartCard } from '@/components/cart-list/CartCard';
import { getEnrichedCart } from '@/utils/firebase.util';
import { updateClient } from '@/store/asyncThunk';
import Image from 'next/image';

export interface ICartListProps {
  serverClient: IClientEnriched;
  config: IConfig;
}

export function CartList({serverClient, config}: ICartListProps) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    if (serverClient) {
      setData(Object.values(serverClient.cart));
    }
  }, []);

  useEffect(() => {
    if (client?.cart) {
      getEnrichedCart(client?.cart).then(enrichedCart => {
        setData(Object.values(enrichedCart));
      });
    }
  }, [client]);

  const cleanCart = async () => {
    dispatch(updateClient({
      clientId: getClientId(),
      data: {
        ...client,
        cart: {}
      }
    }));
  };

  return data?.length
    ? <div className="w-full">
      <div className="w-full flex justify-between mb-2">
        <h1 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].purchaseCart}</h1>
        <Button
          styleClass="px-4 py-2"
          type={ButtonTypes.BUTTON}
          callback={cleanCart}
        >{TRANSLATES[LOCALE].cleanCart}</Button>
      </div>
      <div className="w-full flex gap-x-4">
        <div>
          {
            data.map((item, index) => {
              return <div key={item.id} className={'py-2 ' + (index !== data.length - 1 ? 'separator' : '')}>
                <CartCard
                  config={config}
                  data={item}
                />
              </div>;
            })
          }
        </div>
        <CartListTotalBar config={config}/>
      </div>
    </div>
    : <div className="w-full h-full py-10 gap-x-2 gap-y-2 flex justify-center items-center text-3xl text-center">
      <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
      <div className="flex flex-col gap-y-4 items-center">
        <h3>{TRANSLATES[LOCALE].emptyCart}</h3>
        <h4 className="text-xl">{TRANSLATES[LOCALE].gotoCatalogToChooseProducts}</h4>
        <Button
          styleClass="flex px-4 justify-center py-2 text-xl"
          href={RouterPath.CATEGORIES}
          loading={loading}
          callback={() => setLoading(true)}
        >{TRANSLATES[LOCALE].intoCatalog}</Button>
      </div>
    </div>
}