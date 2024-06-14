import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';
import { convertToClass } from '@/utils/convert-to-class.util';
import { RequestCallButton } from '@/components/view/RequestCallButton';
import { ProductsSearch } from '@/components/view/ProductsSearch';

interface ISubHeaderProps {
  // eslint-disable-next-line react/require-default-props
  config?: IConfig;
}

export function SubHeader({ config }: ISubHeaderProps) {
  const hostClass: string = useMemo(
    () =>
      convertToClass([
        'flex',
        'flex-col md:flex-row',
        'justify-between',
        'items-center',
        'mb-2',
      ]),
    []
  );

  return (
    <ContentContainer styleClass={hostClass}>
      <div className="hidden md:flex justify-between items-center w-full gap-x-10">
        <Link
          className="flex justify-center items-center"
          href={RouterPath.HOME}
        >
          <Image
            className="rounded-full"
            width={150}
            height={150}
            src="/images/logo.jpg"
            alt="Instagram"
          />
        </Link>
        <h1 className="uppercase text-center font-bold">
          {TRANSLATES[LOCALE].сonsumables}
        </h1>
        <ProductsSearch config={config} />
        <div className="text-center font-bold">
          <a href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
            {config?.contactPhone}
          </a>
          <div>{config?.workingHours}</div>
        </div>
        <RequestCallButton />
      </div>

      <div className="w-full hidden 3xs:flex items-center justify-between md:hidden mb-4">
        <div className="uppercase text-center w-3/12 font-bold">
          {TRANSLATES[LOCALE].сonsumables}
        </div>
        <ProductsSearch config={config} />
        <div className="w-6/12 flex flex-col items-center">
          <Link
            className="flex justify-center items-center mb-2"
            href={RouterPath.HOME}
          >
            <Image
              className="rounded-full"
              width={150}
              height={150}
              src="/images/logo.jpg"
              alt="Instagram"
            />
          </Link>
          <RequestCallButton />
        </div>
        <div className="text-center font-bold w-3/12">
          <a href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
            {config?.contactPhone}
          </a>
          <div>{config?.workingHours}</div>
        </div>
      </div>

      <div className="flex flex-col 3xs:hidden mb-2 md:mb-4">
        <Link
          className="flex justify-center items-center mb-2"
          href={RouterPath.HOME}
        >
          <Image
            className="rounded-full"
            width={150}
            height={150}
            src="/images/logo.jpg"
            alt="Instagram"
          />
        </Link>
        <div className="uppercase text-center font-bold mb-2">
          {TRANSLATES[LOCALE].сonsumables}
        </div>
        <RequestCallButton />
        <div className="text-center font-bold">
          <a href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
            {config?.contactPhone}
          </a>
          <div>{config?.workingHours}</div>
        </div>
      </div>
    </ContentContainer>
  );
}
