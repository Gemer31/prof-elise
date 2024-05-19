import { RouterPath, UrlQueryParamsNames } from '@/app/enums';
import { OrderByDirection } from '@firebase/firestore';

export function getCategoryUrl({
                                 categoryId,
                                 page,
                                 pageLimit,
                                 byPrice,
                                 byDate,
                                 byAlfabet,
                                 priceMin,
                                 priceMax
                               }: {
  categoryId: string,
  page: number,
  pageLimit: number,
  byPrice?: OrderByDirection,
  byDate?: OrderByDirection,
  byAlfabet?: OrderByDirection,
  priceMin?: string,
  priceMax?: string
}): string {
  return RouterPath.CATEGORIES
    + '/'
    + categoryId
    + '?' + UrlQueryParamsNames.PAGE + '=' + page
    + '&' + UrlQueryParamsNames.PAGE_LIMIT + '=' + pageLimit
    + (byPrice ? ('&' + UrlQueryParamsNames.BY_PRICE + '=' + byPrice) : '')
    + (byDate ? ('&' + UrlQueryParamsNames.BY_DATE + '=' + byDate) : '')
    + (byAlfabet ? ('&' + UrlQueryParamsNames.BY_ALFABET + '=' + byAlfabet) : '')
    + (priceMin ? ('&' + UrlQueryParamsNames.PRICE_MIN + '=' + priceMin) : '')
    + (priceMax ? ('&' + UrlQueryParamsNames.PRICE_MAX + '=' + priceMin) : '');
}