'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes } from '@/app/enums';
import { CartListTotalBar } from '@/components/cart-list/CartListTotalBar';
import { useEffect, useMemo, useState } from 'react';
import { IClientEnriched, IConfig } from '@/app/models';
import { getClientId } from '@/utils/cookies.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CartCard } from '@/components/cart-list/CartCard';

export interface ICartListProps {
  serverClient: IClientEnriched;
  config: IConfig;
}

export function CartList({serverClient, config}: ICartListProps) {
  const [data, setData] = useState([]);
  const clientId = useMemo(() => getClientId(), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    if (serverClient) {
      setData(Object.values(serverClient.cart));
    }
  }, []);

  useEffect(() => {
    // setData(Object.values(client.cart));
  }, [client]);

  const cleanCart = async () => {
    // const newClient: IClient;
    // await setDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId), {
    //
    // })
  };

  return <div className="w-full">
    <div className="w-full flex justify-between mb-2">
      <h1 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].purchaseCart}</h1>
      <Button
        styleClass="px-4 py-2"
        type={ButtonTypes.BUTTON}
        callback={() => cleanCart}
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
            </div>
          })
        }
      </div>
      <CartListTotalBar config={config}/>
    </div>
  </div>;
}