'use client';

import { IClient, IConfig, IProduct } from '@/app/models';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { FavouriteProductCard } from '@/components/favourite-product-card/FavouriteProductCard';
import './favourites-list.css';
import { Button } from '@/components/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { updateClient } from '@/store/asyncThunk';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getClientId } from '@/utils/cookies.util';

interface IFavouritesListProps {
  config: IConfig;
  serverProducts: IProduct[];
}

export function FavouritesList({serverProducts, config}: IFavouritesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');
  const [intoCatalogRedirectInProgress, setIntoCatalogRedirectInProgress] = useState(false);
  const [data, setData] = useState<IProduct[]>([]);
  const dispatch = useAppDispatch();
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    setData(serverProducts);
  }, [serverProducts]);

  const cleanFavourites = () => {
    setData([]);
    dispatch(updateClient({
      clientId: getClientId(),
      data: {
        ...client,
        favourites: {}
      }
    }));
  };

  return <>
    {
      data?.length
        ? <div className="flex justify-end my-4">
          <Button styleClass="px-2 py-1" type={ButtonTypes.BUTTON} callback={cleanFavourites}>
            {TRANSLATES[LOCALE].cleanFavourites} ✖
          </Button>
        </div>
        : <></>
    }
    {
      data?.length
        ? <div className="w-full">
          <div className="separator">
            <div className="favourites-list-header text-lg">
              <span>{TRANSLATES[LOCALE].naming}</span>
              <span>{TRANSLATES[LOCALE].price}</span>
            </div>
          </div>
          {
            data.map((favourite, index) => <div
              className={'w-full ' + (index !== data.length - 1 ? 'separator' :'')}
              key={favourite.id}
            >
              <FavouriteProductCard
                config={config}
                data={favourite}
                isLoading={redirectIdInProgress === favourite.id}
                onClick={() => setRedirectIdInProgress(favourite.id)}
              />
            </div>)
          }
        </div>
        : <div className="w-full h-full py-10 gap-x-2 gap-y-2 flex justify-center items-center text-3xl text-center">
          <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
          <div className="flex flex-col gap-y-4 items-center">
            <h3>{TRANSLATES[LOCALE].thereAreNoFavouritesProducts}</h3>
            <h4 className="text-xl">{TRANSLATES[LOCALE].addToFavouritesHint}</h4>
            <Button
              styleClass="flex px-4 py-2 text-xl"
              href={RouterPath.CATEGORIES}
              loading={intoCatalogRedirectInProgress}
              callback={() => setIntoCatalogRedirectInProgress(true)}
            >{TRANSLATES[LOCALE].intoCatalog}</Button>
          </div>
        </div>
    }
  </>;
}