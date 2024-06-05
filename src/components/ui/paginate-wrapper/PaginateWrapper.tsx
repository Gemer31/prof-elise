'use client';

import { OrderByKeys, PageLimits, PaginateItemsPosition } from '@/app/enums';
import { SortByButton } from '@/components/ui/SortByButton';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { PagesToolbar } from '@/components/ui/paginate-wrapper/PagesToolbar';
import { ICommonProps, IOrderByModel } from '@/app/models';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { OrderByDirection } from '@firebase/firestore';
import { getPaginateUrl } from '@/utils/router.util';
import Image from 'next/image';

const PaginateItemsPositionClasses: Map<string, string> = new Map([
  [PaginateItemsPosition.LINE, 'w-full flex flex-col'],
  [PaginateItemsPosition.GRID, 'w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-2 mb-4'],
])

interface IPaginateWrapperProps extends ICommonProps {
  orderByAvailableParams?: {
    [OrderByKeys.BY_DATE]?: boolean;
    [OrderByKeys.BY_ALFABET]?: boolean;
    [OrderByKeys.BY_PRICE]?: boolean;
  }
  itemsPosition: PaginateItemsPosition;
  items: unknown[];
  emptyListText: string;
  orderByParams?: IOrderByModel;
  baseRedirectUrl: string;
  pagesCount: number;
  pageLimit: number;
  page: number;
  minPrice?: string;
  maxPrice?: string;
  searchValue?: string;
}

export function PaginateWrapper({
                                  page,
                                  baseRedirectUrl,
                                  pageLimit,
                                  pagesCount,
                                  orderByParams,
                                  minPrice,
                                  maxPrice,
                                  searchValue,
                                  children,
                                  items,
                                  itemsPosition,
                                  emptyListText,
                                  orderByAvailableParams,
                                }: IPaginateWrapperProps) {
  const router = useRouter();
  const [pageLimitValue, setPageLimitValue] = useState(pageLimit);
  const [sortType, setSortType] = useState<OrderByKeys | string>();
  const [sortValue, setSortValue] = useState<OrderByDirection>();
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  useEffect(() => {
    setSortType(orderByParams?.key);
    setSortValue(orderByParams?.value);
  }, [orderByParams]);

  const pageLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLimit: number = Number(event.target.value);
    setPageLimitValue(newLimit);
    router.push(getPaginateUrl({
      baseUrl: baseRedirectUrl,
      page: 1,
      pageLimit: newLimit,
      orderBy: orderByParams,
      minPrice,
      maxPrice,
      searchValue
    }));
  };
  const sortByChange = (newType: string, newValue: OrderByDirection) => {
    setSortType(newType);
    setSortValue(newValue);
    router.push(getPaginateUrl({
      baseUrl: baseRedirectUrl,
      page,
      pageLimit,
      orderBy: {
        key: newType,
        value: newValue
      },
      maxPrice,
      minPrice,
      searchValue
    }));
  };

  return <article className="w-full">
    <div className="flex justify-between mb-4">
      <div className="flex gap-x-3">
        {
          Object.keys(orderByAvailableParams)
            // @ts-ignore
            .filter(item => orderByAvailableParams[item])
            .map(item => (
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
    {
      items.length
        ? <div className={PaginateItemsPositionClasses.get(itemsPosition)}>
          {children}
        </div>
        : <section className="w-full h-full flex justify-center items-center gap-x-6">
          <Image width={80} height={80} src="/icons/no-items.svg" alt="No items"/>
          <span className="text-2xl">{emptyListText}</span>
        </section>
    }
    <PagesToolbar
      minPrice={minPrice}
      maxPrice={maxPrice}
      baseRedirectUrl={baseRedirectUrl}
      pages={pagesCount}
      pageLimit={pageLimit}
      searchValue={searchValue}
      current={page}
      orderByParams={{key: sortType, value: sortValue}}
    />
  </article>;
}