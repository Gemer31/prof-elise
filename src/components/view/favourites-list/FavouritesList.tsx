'use client';

import { IConfig, IProductSerialized } from '@/app/models';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { FavouriteProductCard } from '@/components/view/favourites-list/favourite-product-card/FavouriteProductCard';
import './favourites-list.css';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { updateFavourites } from '@/store/asyncThunk';
import { useAppDispatch } from '@/store/store';
import { getClientId } from '@/utils/cookies.util';
import { revalidatePath, revalidateTag } from 'next/cache';
import { revalidateFavourites } from '@/app/actions';

interface IFavouritesListProps {
  config: IConfig;
  serverProducts: IProductSerialized[];
}

export function FavouritesList({serverProducts, config}: IFavouritesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');
  const [intoCatalogRedirectInProgress, setIntoCatalogRedirectInProgress] = useState(false);
  const [init, setInit] = useState(false);
  const [data, setData] = useState<IProductSerialized[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setData(serverProducts);
    setInit(true);
  }, [serverProducts]);

  const cleanFavourites = async () => {
    setData([]);
    dispatch(updateFavourites({clientId: getClientId(), data: {}}));
    await revalidateFavourites();
  };

  return (init ? data?.length : serverProducts?.length)
    ? <div className="w-full">
      {
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-center text-2xl uppercase">{TRANSLATES[LOCALE].favouriteProducts}</h1>
          <Button styleClass="px-2 py-1 text-sm" type={ButtonTypes.BUTTON} callback={cleanFavourites}>
            {TRANSLATES[LOCALE].cleanFavourites} ✖
          </Button>
        </div>
      }
      {
        (init ? data : serverProducts).map((favourite, index) => <FavouriteProductCard
          key={favourite.id}
          config={config}
          data={favourite}
          isLoading={redirectIdInProgress === favourite.id}
          onClick={() => setRedirectIdInProgress(favourite.id)}
        />)
      }
    </div>
    : <div className="w-full h-full py-10 gap-x-2 gap-y-2 flex justify-center items-center text-3xl text-center">
      <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
      <div className="flex flex-col gap-y-4 items-center">
        <h3>{TRANSLATES[LOCALE].thereAreNoFavouritesProducts}</h3>
        <h4 className="text-xl">{TRANSLATES[LOCALE].addToFavouritesHint}</h4>
        <Button
          styleClass="flex justify-center px-4 py-2 text-xl"
          href={RouterPath.CATEGORIES}
          loading={intoCatalogRedirectInProgress}
          callback={() => setIntoCatalogRedirectInProgress(true)}
        >{TRANSLATES[LOCALE].intoCatalog}</Button>
      </div>
    </div>;
}