import { Button } from '@/components/Button';
import { ButtonTypes, ColorOptions, PageLimits, RouterPath } from '@/app/enums';
import Link from 'next/link';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IPagesToolbarProps {
  pages: number;
  current: number;
  categoryId: string;
}

export function PagesToolbar({current, pages, categoryId}: IPagesToolbarProps) {
  return <div className={'w-full justify-center gap-x-1 ' + (pages < 2 ? 'hidden' : 'flex')}>
    {
      current === 1
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={`${RouterPath.CATEGORIES}/${categoryId}?page=${current - 1}&pageLimit=${PageLimits.SIX}`}
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
          href={`${RouterPath.CATEGORIES}/${categoryId}?page=${value}&pageLimit=${PageLimits.SIX}`}
        >{value}</Button>
      })
    }
    {
      current === pages
        ? <></>
        : <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={`${RouterPath.CATEGORIES}/${categoryId}?page=${current + 1}&pageLimit=${PageLimits.SIX}`}
        >→</Button>
    }
  </div>;
}