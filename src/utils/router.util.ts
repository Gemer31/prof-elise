import { UrlQueryParamsNames } from '@/app/enums';
import { IPaginateProps } from '@/app/models';

export function getPaginateUrl({
  baseRedirectUrl,
  pageLimit,
  page,
  orderByParams,
  minPrice,
  maxPrice,
  searchValue,
}: IPaginateProps): string {
  return (
    baseRedirectUrl +
    '?' +
    UrlQueryParamsNames.PAGE +
    '=' +
    page +
    '&' +
    UrlQueryParamsNames.PAGE_LIMIT +
    '=' +
    pageLimit +
    (orderByParams?.value
      ? '&' + orderByParams.key + '=' + (orderByParams?.value || '')
      : '') +
    (minPrice ? '&' + UrlQueryParamsNames.MIN_PRICE + '=' + minPrice : '') +
    (maxPrice ? '&' + UrlQueryParamsNames.MAX_PRICE + '=' + maxPrice : '') +
    (searchValue
      ? '&' + UrlQueryParamsNames.SEARCH_VALUE + '=' + searchValue
      : '')
  );
}
