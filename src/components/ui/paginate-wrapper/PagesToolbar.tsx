import { Button } from '@/components/ui/Button';
import { ColorOptions } from '@/app/enums';
import { getPaginateUrl } from '@/utils/router.util';
import { IPaginateProps } from '@/app/models';

interface IPagesToolbarProps {
  paginateProps: IPaginateProps,
}

export function PagesToolbar(
  {
    paginateProps: {
      orderByParams,
      minPrice,
      maxPrice,
      searchValue,
      baseRedirectUrl,
      page,
      pagesCount,
      pageLimit
    }
  }: IPagesToolbarProps
) {
  return <div className={'w-full justify-center gap-x-1 ' + (pagesCount < 2 ? 'hidden' : 'flex')}>
    {
      page === 1
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={getPaginateUrl({
            baseRedirectUrl,
            page: page - 1,
            pageLimit,
            orderByParams,
            maxPrice,
            minPrice,
            searchValue
          })}
        >←</Button>
    }
    {
      Array(pagesCount).fill(null).map((item, index) => {
        const value: number = index + 1;
        return <Button
          color={value === page ? ColorOptions.PINK : ColorOptions.GRAY}
          disabled={value === page}
          key={`${value}${page}`}
          styleClass="flex px-4 py-2"
          href={getPaginateUrl({
            baseRedirectUrl,
            page: value,
            pageLimit,
            orderByParams,
            maxPrice,
            minPrice,
            searchValue
          })}
        >{value}</Button>;
      })
    }
    {
      page === pagesCount
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={getPaginateUrl({
            baseRedirectUrl,
            page: page + 1,
            pageLimit,
            orderByParams,
            maxPrice,
            minPrice,
            searchValue
          })}
        >→</Button>
    }
  </div>;
}