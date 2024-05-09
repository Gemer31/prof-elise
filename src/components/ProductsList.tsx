'use client';

import { ProductCard } from '@/components/product-card/ProductCard';
import { IConfig, IProduct } from '@/app/models';
import { useState } from 'react';

export interface IProductsListProps {
  data: IProduct[];
  config: IConfig;
}

export function ProductsList({data, config}: IProductsListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return data?.map((product) => {
    return <ProductCard
      key={product.id}
      data={product}
      config={config}
      isLoading={redirectIdInProgress === product.id}
      onClick={() => setRedirectIdInProgress(product.id)}
    />
  });
}