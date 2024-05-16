'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import { Button } from '@/components/Button';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';
import { useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';

interface ISubHeaderProps {
  config?: IConfig;
}

export function SubHeader({config}: ISubHeaderProps) {
  const containerClass: string = useMemo(() => convertToClass([
    'flex',
    'flex-col md:flex-row',
    'justify-between',
    'items-center',
    'mb-2'
  ]), []);
  const infoClass: string = useMemo(() => convertToClass([
    'w-full md:w-8/12',
    'hidden 3xs:flex md:hidden',
    'justify-between',
    'items-center',
    'mb-2 md:mb-0'
  ]), []);

  return <ContentContainer styleClass={containerClass}>
    <div className="hidden md:flex justify-between w-full">
      <Link className="flex justify-center items-center w-3/12" href={RouterPath.HOME}>
        <Image className="rounded-full" width={150} height={150} src="/images/logo.jpg" alt="Instagram"/>
      </Link>
      <div className="w-8/12 flex justify-between items-center">
        <h1 className="uppercase text-center w-20 font-bold">{TRANSLATES[LOCALE].сonsumables}</h1>
        <div className="text-center font-bold w-3/12">
          <a
            href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>{config?.contactPhone}</a>
          <div>{config?.workingHours}</div>
        </div>
        {/*<Button*/}
        {/*  styleClass="hidden md:block uppercase text-amber-50 px-4 py-2"*/}
        {/*  type={ButtonType.BUTTON}*/}
        {/*  callback={() => dispatch(setRequestCallPopupVisible(true))}*/}
        {/*>{TRANSLATES[LOCALE].requestCall}</Button>*/}
      </div>
    </div>

    <div className="w-full hidden 3xs:flex items-center justify-between md:hidden mb-4">
      <div className="uppercase text-center w-3/12 font-bold">{TRANSLATES[LOCALE].сonsumables}</div>
      {/*<Search/>*/}
      <div className="w-6/12 flex flex-col items-center">
        <Link className="flex justify-center items-center mb-2" href={RouterPath.HOME}>
          <Image className="rounded-full" width={150} height={150} src="/images/logo.jpg" alt="Instagram"/>
        </Link>
        {/*<Button*/}
        {/*  styleClass="uppercase text-amber-50 px-4 py-2"*/}
        {/*  type={ButtonType.BUTTON}*/}
        {/*  callback={() => dispatch(setRequestCallPopupVisible(true))}*/}
        {/*>{TRANSLATES[LOCALE].requestCall}</Button>*/}
      </div>
      <div className="text-center font-bold w-3/12">
        <a
          href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>{config?.contactPhone}</a>
        <div>{config?.workingHours}</div>
      </div>
    </div>

    <div className="flex flex-col 3xs:hidden mb-2 md:mb-4">
      <Link className="flex justify-center items-center mb-2" href={RouterPath.HOME}>
        <Image className="rounded-full" width={150} height={150} src="/images/logo.jpg" alt="Instagram"/>
      </Link>
      <div className="uppercase text-center font-bold mb-2">{TRANSLATES[LOCALE].сonsumables}</div>
      <Button
        styleClass="uppercase text-amber-50 px-4 py-2 mb-2"
        type={ButtonTypes.BUTTON}
        callback={() => dispatch(setRequestCallPopupVisible(true))}
      >{TRANSLATES[LOCALE].requestCall}</Button>
      <div className="text-center font-bold">
        <a
          href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>{config?.contactPhone}</a>
        <div>{config?.workingHours}</div>
      </div>
    </div>
  </ContentContainer>;
}