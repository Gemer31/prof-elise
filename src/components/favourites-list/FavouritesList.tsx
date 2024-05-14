'use client';

import { IConfig, IProduct } from '@/app/models';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { FavouriteProductCard } from '@/components/FavouriteProductCard';
import './favourites-list.css';
import { Button } from '@/components/Button';
import { ButtonTypes } from '@/app/enums';
import { updateClient } from '@/store/asyncThunk';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getClientId } from '@/utils/cookies.util';
import { IClient } from '@/store/dataSlice';

interface IFavouritesListProps {
  config: IConfig;
  serverProducts: IProduct[];
}

export function FavouritesList({serverProducts, config}: IFavouritesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');
  const [data, setData] = useState<IProduct[]>([]);
  const clientId = useMemo(() => getClientId(), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    setData(serverProducts);
  }, [serverProducts]);

  const cleanFavourites = () => {
    setData([]);
    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        favourites: {},
      }
    }));
  }

  return <>
    <div className="flex justify-end my-2">
      <Button styleClass="px-2 py-1" type={ButtonTypes.BUTTON} callback={cleanFavourites}>
        {TRANSLATES[LOCALE].cleanFavourites} ✖
      </Button>
    </div>
    {
      data?.length
        ? <div className="w-full">
          <div className="separator">
            <div className="favourites-list-header">
              <span>{TRANSLATES[LOCALE].naming}</span>
              <span>{TRANSLATES[LOCALE].price}</span>
            </div>
          </div>
          {
            data.map((favourite) => <FavouriteProductCard
              key={favourite.id}
              config={config}
              data={favourite}
              isLoading={redirectIdInProgress === favourite.id}
              onClick={() => setRedirectIdInProgress(favourite.id)}
            />)
          }
        </div>
        : <div className="w-full flex justify-center items-center text-3xl text-center">
          <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
          <span>{TRANSLATES[LOCALE].emptyCart}</span>
        </div>
    }
  </>;
}