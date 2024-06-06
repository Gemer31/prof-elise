'use client';

import { ProductCard } from '@/components/view/product-card/ProductCard';
import { IConfig, IPaginateProps, IProductSerialized } from '@/app/models';
import { useState } from 'react';
import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { OrderByKeys, PaginateItemsPosition } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface IProductsListProps {
  data: IProductSerialized[];
  config: IConfig;
  paginateProps: IPaginateProps;
}

export function ProductsList({data, config, paginateProps}: IProductsListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return <PaginateWrapper
    orderByAvailableParams={{
      [OrderByKeys.BY_DATE]: true,
      [OrderByKeys.BY_PRICE]: true,
      [OrderByKeys.BY_ALFABET]: true
    }}
    itemsPosition={PaginateItemsPosition.GRID}
    items={data}
    emptyListText={TRANSLATES[LOCALE].thereAreNoProductsWithSelectedFilter}
    paginateProps={paginateProps}
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