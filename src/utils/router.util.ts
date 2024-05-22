import { RouterPath, UrlQueryParamsNames } from '@/app/enums';
import { IOrderByModel } from '@/app/models';

export function getCategoryUrl({
                                 categoryId,
                                 page,
                                 pageLimit,
                                 orderBy,
                                 priceMin,
                                 priceMax
                               }: {
  categoryId: string,
  page: number,
  pageLimit: number,
  orderBy?: IOrderByModel
  priceMin?: string,
  priceMax?: string
}): string {
  return RouterPath.CATEGORIES
    + '/'
    + categoryId
    + '?' + UrlQueryParamsNames.PAGE + '=' + page
    + '&' + UrlQueryParamsNames.PAGE_LIMIT + '=' + pageLimit
    + (orderBy?.value ? ('&' + orderBy.key + '=' + orderBy?.value) : '')
    + (priceMin ? ('&' + UrlQueryParamsNames.PRICE_MIN + '=' + priceMin) : '')
    + (priceMax ? ('&' + UrlQueryParamsNames.PRICE_MAX + '=' + priceMin) : '');
}