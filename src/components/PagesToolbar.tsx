import { Button } from '@/components/Button';
import { ColorOptions } from '@/app/enums';
import { getCategoryUrl } from '@/utils/router.util';
import { IOrderByModel } from '@/app/models';

interface IPagesToolbarProps {
  current: number;
  pages: number;
  pageLimit: number;
  orderByParams: IOrderByModel;
  categoryId: string;
  minPrice?: string;
  maxPrice?: string;
}

export function PagesToolbar({current, pages, pageLimit, categoryId, orderByParams, maxPrice, minPrice}: IPagesToolbarProps) {
  return <div className={'w-full justify-center gap-x-1 ' + (pages < 2 ? 'hidden' : 'flex')}>
    {
      current === 1
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={getCategoryUrl({
            categoryId: categoryId,
            page: current - 1,
            pageLimit,
            orderBy: orderByParams,
            maxPrice,
            minPrice,
          })}
        >←</Button>
    }
    {
      Array(pages).fill(null).map((item, index) => {
        const value: number = index + 1;
        return <Button
          color={value === current ? ColorOptions.PINK : ColorOptions.GRAY}
          disabled={value === current}
          key={`${value}${current}`}
          styleClass="flex px-4 py-2"
          href={getCategoryUrl({
            categoryId: categoryId,
            page: value,
            pageLimit,
            orderBy: orderByParams,
            maxPrice,
            minPrice,
          })}
        >{value}</Button>;
      })
    }
    {
      current === pages
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={getCategoryUrl({
            categoryId: categoryId,
            page: current + 1,
            pageLimit,
            orderBy: orderByParams,
            maxPrice,
            minPrice,
          })}
        >→</Button>
    }
  </div>;
}