import { IPaginateProps, ISearchParams } from '@/app/models';
import { OrderByKeys, PageLimits } from '@/app/enums';
import { OrderByDirection } from '@firebase/firestore';

export function getPagesCount(itemsLength: number, limit: number): number {
  return itemsLength ? Math.ceil(itemsLength / limit) : 0;
}

export function getPaginateProps(searchParams: ISearchParams): IPaginateProps {
  let orderByKey: OrderByKeys;
  let orderByValue: OrderByDirection;
  Object.keys(searchParams)?.every(key => {
    switch (key) {
      case OrderByKeys.BY_PRICE: {
        orderByKey = OrderByKeys.BY_PRICE;
        orderByValue = searchParams[OrderByKeys.BY_PRICE];
        break;
      }
      case OrderByKeys.BY_DATE: {
        orderByKey = OrderByKeys.BY_DATE;
        orderByValue = searchParams[OrderByKeys.BY_DATE];
        break;
      }
      case OrderByKeys.BY_ALFABET: {
        orderByKey = OrderByKeys.BY_ALFABET;
        orderByValue = searchParams[OrderByKeys.BY_ALFABET];
        break;
      }
    }
    if (orderByValue) {
      if (orderByValue !== 'desc' && orderByValue !== 'asc') {
        orderByValue = 'desc';
      }
      return false;
    }
    return true;
  });

  return {
    page: Number(searchParams.page),
    pageLimit: searchParams.pageLimit ? Number(searchParams.pageLimit) : Number(PageLimits.SIX),
    minPrice: searchParams.minPrice?.length ? Number(searchParams.minPrice) : null,
    maxPrice: searchParams.maxPrice?.length ? Number(searchParams.maxPrice) : null,
    searchValue: searchParams.q,
    orderByParams: {
      key: orderByKey,
      value: orderByValue
    }
  };
}