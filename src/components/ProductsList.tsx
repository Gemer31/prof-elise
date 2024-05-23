'use client';

import { ProductCard } from '@/components/product-card/ProductCard';
import { IConfig, IOrderByModel, IProduct } from '@/app/models';
import { ChangeEvent, useEffect, useState } from 'react';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useRouter } from 'next/navigation';
import { PageLimits, OrderByKeys } from '@/app/enums';
import { PagesToolbar } from '@/components/PagesToolbar';
import { SortByButton } from '@/components/SortByButton';
import { getCategoryUrl } from '@/utils/router.util';
import { OrderByDirection } from '@firebase/firestore';

export interface IProductsListProps {
  data: IProduct[];
  config: IConfig;
  categoryId: string;
  pagesCount: number;
  pageLimit: number;
  page: number;
  orderByParams?: IOrderByModel;
}

export function ProductsList({
                               data,
                               config,
                               pageLimit,
                               page,
                               pagesCount,
                               categoryId,
                               orderByParams
                             }: IProductsListProps) {
  const router = useRouter();
  const [pageLimitValue, setPageLimitValue] = useState(pageLimit);
  const [sortType, setSortType] = useState<OrderByKeys>();
  const [sortValue, setSortValue] = useState<OrderByDirection>();
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');


  useEffect(() => {
    setSortType(orderByParams.key);
    setSortValue(orderByParams.value);
  }, [orderByParams]);
  const pageLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLimit: number = Number(event.target.value);
    setPageLimitValue(newLimit);
    router.push(getCategoryUrl({
      categoryId,
      page: 1,
      pageLimit: newLimit,
      orderBy: orderByParams,
    }));
  };
  const sortByChange = (newType: OrderByKeys, newValue: OrderByDirection) => {
    setSortType(newType);
    setSortValue(newValue);
    router.push(getCategoryUrl({
      categoryId,
      page,
      pageLimit,
      orderBy: {
        key: newType,
        value: newValue
      },
    }));
  };

  return <div className="w-full">
    <div className="flex justify-between mb-4">
      <div className="flex gap-x-3">
        {
          Object.values(OrderByKeys).map(item => (
            <SortByButton
              key={item}
              value={sortType === item ? sortValue : null}
              onClick={(newValue) => sortByChange(item, newValue)}
            >{TRANSLATES[LOCALE][item]}</SortByButton>
          ))
        }
      </div>
      <div className="flex items-center">
        {TRANSLATES[LOCALE].showBy}:
        <select
          className="mx-2 border-2 rounded-md border-pink-500"
          value={pageLimitValue}
          onChange={pageLimitChange}
        >
          {
            Object.values(PageLimits).map(item => (<option key={item} value={item}>{item}</option>))
          }
        </select>
        {TRANSLATES[LOCALE].productsOnThePage}
      </div>
    </div>
    <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
      {data?.map((product) => {
        return <ProductCard
          key={product.id}
          data={product}
          config={config}
          isLoading={redirectIdInProgress === product.id}
          onClick={() => setRedirectIdInProgress(product.id)}
        />;
      })}
    </div>
    <PagesToolbar
      categoryId={categoryId}
      pages={pagesCount}
      pageLimit={pageLimit}
      current={page}
      orderByParams={{ key: sortType, value: sortValue }}
    />
  </div>;
}