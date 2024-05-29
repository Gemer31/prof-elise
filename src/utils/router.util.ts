import { UrlQueryParamsNames } from '@/app/enums';
import { IOrderByModel } from '@/app/models';

export function getPaginateUrl({
                                 baseUrl,
                                 page,
                                 pageLimit,
                                 orderBy,
                                 minPrice,
                                 maxPrice
                               }: {
  baseUrl: string,
  page: number,
  pageLimit: number,
  orderBy?: IOrderByModel
  minPrice?: string,
  maxPrice?: string
}): string {
  return baseUrl
    + '?' + UrlQueryParamsNames.PAGE + '=' + page
    + '&' + UrlQueryParamsNames.PAGE_LIMIT + '=' + pageLimit
    + (orderBy?.value ? ('&' + orderBy.key + '=' + orderBy?.value) : '')
    + (minPrice ? ('&' + UrlQueryParamsNames.MIN_PRICE + '=' + minPrice) : '')
    + (maxPrice ? ('&' + UrlQueryParamsNames.MAX_PRICE + '=' + maxPrice) : '');
}