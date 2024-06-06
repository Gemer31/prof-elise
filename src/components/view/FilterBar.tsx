'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ButtonTypes } from '@/app/enums';
import { ChangeEvent, useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { IConfig, IPaginateProps } from '@/app/models';
import { useRouter } from 'next/navigation';
import { getPaginateUrl } from '@/utils/router.util';

export interface IFilterBarProps {
  config: IConfig;
  paginateProps: IPaginateProps;
}

export function FilterBar(
  {
    config,
    paginateProps: {
      baseRedirectUrl,
      pageLimit,
      searchValue,
      orderByParams,
      minPrice,
      maxPrice
    }
  }: IFilterBarProps
) {
  const hostClass: string = useMemo(() => convertToClass([
    'border-2',
    'rounded-md',
    'mt-1',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);
  const router = useRouter();

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();

    router.push(getPaginateUrl({
      baseRedirectUrl,
      page: 1,
      pageLimit,
      orderByParams,
      // @ts-ignore
      minPrice: e.target?.[0]?.value,
      // @ts-ignore
      maxPrice: e.target?.[1]?.value,
      searchValue
    }));
  };

  return <section className="bg-pink-300 rounded-md px-4 py-3 mt-1">
    <h3 className="text-center text-lg font-bold pb-1">{TRANSLATES[LOCALE].filter}</h3>
    <form className="flex flex-col gap-y-2" onSubmit={onSubmit}>
      <div>
        {TRANSLATES[LOCALE].price}, {config.currency}
        <div className="flex justify-between items-center gap-x-2">
          <input
            placeholder={TRANSLATES[LOCALE].from}
            defaultValue={minPrice}
            pattern="^[0-9]*$"
            className={hostClass}
          />
          —
          <input
            placeholder={TRANSLATES[LOCALE].to}
            defaultValue={maxPrice}
            pattern="^[0-9]*$"
            className={hostClass}
          />
        </div>
      </div>
      <Button
        styleClass="w-full px-4 py-2"
        type={ButtonTypes.SUBMIT}
      >{TRANSLATES[LOCALE].accept}</Button>
    </form>
  </section>;
}