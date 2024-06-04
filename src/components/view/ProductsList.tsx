'use client';

import { ProductCard } from '@/components/view/product-card/ProductCard';
import { IConfig, IOrderByModel, IProduct } from '@/app/models';
import { useState } from 'react';
import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { PaginateItemsPosition } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface IProductsListProps {
  data: IProduct[];
  config: IConfig;
  baseRedirectUrl: string;
  pagesCount: number;
  pageLimit: number;
  page: number;
  searchValue?: string;
  orderByParams?: IOrderByModel;
  minPrice?: string;
  maxPrice?: string;
}

export function ProductsList({
                               data,
                               config,
                               pageLimit,
                               page,
                               pagesCount,
                               baseRedirectUrl,
                               orderByParams,
                               maxPrice,
                               minPrice,
                               searchValue
                             }: IProductsListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return <PaginateWrapper
    itemsPosition={PaginateItemsPosition.GRID}
    items={data}
    emptyListText={TRANSLATES[LOCALE].thereAreNoProductsWithSelectedFilter}
    baseRedirectUrl={baseRedirectUrl}
    pagesCount={pagesCount}
    pageLimit={pageLimit}
    page={page}
    searchValue={searchValue}
    maxPrice={maxPrice}
    minPrice={minPrice}
    orderByParams={orderByParams}
  >
    {data?.map((product) => {
      return <ProductCard
        key={product.id}
        data={product}
        config={config}
        isLoading={redirectIdInProgress === product.id}
        onClick={() => setRedirectIdInProgress(product.id)}
      />;
    })}
  </PaginateWrapper>;
}