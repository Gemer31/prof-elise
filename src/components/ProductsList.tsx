'use client';

import { ProductCard } from '@/components/product-card/ProductCard';
import { IConfig, IProduct } from '@/app/models';
import { useState } from 'react';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useRouter } from 'next/navigation';
import { PageLimits, RouterPath } from '@/app/enums';
import { PagesToolbar } from '@/components/PagesToolbar';

export interface IProductsListProps {
  data: IProduct[];
  config: IConfig;
  categoryId: string;
  pagesCount: number;
  pageLimit: number;
  page: number;
}

export function ProductsList({data, config, pageLimit, page, pagesCount, categoryId}: IProductsListProps) {
  const router = useRouter();
  const [pageLimitValue, setPageLimitValue] = useState(pageLimit);
  const [sortType, setSortType] = useState();
  const [sortValue, setSortValue] = useState();
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  const pageLimitChange = (event) => {
    const newLimit: number = event.target.value;
    setPageLimitValue(newLimit);
    router.push(`${RouterPath.CATEGORIES}/${categoryId}?page=${page}&pageLimit=${newLimit}`);
  }

  return <div className="w-full">
    <div className="flex justify-between mb-4">
      <div className="flex">
        {/*{*/}
        {/*  Object.values(SortValues).map(item => (*/}
        {/*    <SortByButton*/}
        {/*      key={item}*/}
        {/*      isActive={sortValue === item}*/}
        {/*      callback={(type) => {*/}
        {/*        setSortType(type);*/}
        {/*        setSortValue(item);*/}
        {/*      }}*/}
        {/*    >{TRANSLATES[LOCALE].byPrice}</SortByButton>*/}
        {/*  ))*/}
        {/*}*/}
      </div>
      <div className="flex items-center">
        {TRANSLATES[LOCALE].showBy}:
        <select className="mx-2 border-2 rounded-md border-pink-500" value={pageLimitValue} onChange={pageLimitChange}>
          {
            Object.values(PageLimits).map(item => (<option key={item} value={item}>{item}</option>))
          }
        </select>
        {TRANSLATES[LOCALE].productsOnThePage}
      </div>
    </div>
    <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
    <PagesToolbar categoryId={categoryId} pages={pagesCount} current={page}/>
  </div>
}