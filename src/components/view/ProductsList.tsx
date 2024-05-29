'use client';

import { ProductCard } from '@/components/view/product-card/ProductCard';
import { IConfig, IOrderByModel, IProduct } from '@/app/models';
import { useState } from 'react';
import { RouterPath } from '@/app/enums';
import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';

export interface IProductsListProps {
  data: IProduct[];
  config: IConfig;
  categoryId: string;
  pagesCount: number;
  pageLimit: number;
  page: number;
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
                               categoryId,
                               orderByParams,
                               maxPrice,
                               minPrice
                             }: IProductsListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return <PaginateWrapper
    baseRedirectUrl={RouterPath.CATEGORIES + '/' + categoryId}
    pagesCount={pagesCount}
    pageLimit={pageLimit}
    page={page}
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