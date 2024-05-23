import { RouterPath, UrlQueryParamsNames } from '@/app/enums';
import { IOrderByModel } from '@/app/models';

export function getCategoryUrl({
                                 categoryId,
                                 page,
                                 pageLimit,
                                 orderBy,
                                 minPrice,
                                 maxPrice
                               }: {
  categoryId: string,
  page: number,
  pageLimit: number,
  orderBy?: IOrderByModel
  minPrice?: string,
  maxPrice?: string
}): string {
  return RouterPath.CATEGORIES
    + '/'
    + categoryId
    + '?' + UrlQueryParamsNames.PAGE + '=' + page
    + '&' + UrlQueryParamsNames.PAGE_LIMIT + '=' + pageLimit
    + (orderBy?.value ? ('&' + orderBy.key + '=' + orderBy?.value) : '')
    + (minPrice ? ('&' + UrlQueryParamsNames.MIN_PRICE + '=' + minPrice) : '')
    + (maxPrice ? ('&' + UrlQueryParamsNames.MAX_PRICE + '=' + maxPrice) : '');
}