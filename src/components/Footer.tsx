'use client';

import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import Link from 'next/link';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { usePathname } from 'next/navigation';
import { IConfig } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';
import { useMemo } from 'react';

export interface IFooterProps {
  config?: IConfig;
}

export function Footer({ config }: IFooterProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const instagramClass: string = useMemo(() => convertToClass([
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-amber-50',
    'm-1',
    'size-12',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]), []);
  const infoClass: string = useMemo(() => convertToClass([
    'flex',
    'flex-col sm:flex-row',
    'justify-between',
    'pt-4',
  ]), []);
  const buttonsClass: string = useMemo(() => convertToClass([
    'flex',
    'flex-row-reverse sm:flex-col',
    'justify-around',
    'items-center',
  ]), []);

  return (
    <footer className="w-full flex justify-center bg-pink-300">
      <ContentContainer styleClass="px-2">
        {
          pathname === RouterPath.LOGIN || pathname === RouterPath.EDITOR
            ? <></>
            : <div className={infoClass}>
              <div className="mb-4 sm:mb-0 flex flex-col items-center">
                <h2 className="text-xl mb-2 sm:mb-4">{TRANSLATES[LOCALE].information}</h2>
                <div>
                  <Link className="" href="/delivery">{TRANSLATES[LOCALE].delivery}</Link>
                </div>
              </div>
              <div className="mb-4 sm:mb-0 flex flex-col items-center">
                <h2 className="text-xl mb-2 sm:mb-4">{TRANSLATES[LOCALE].contacts}</h2>
                <a href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}
                >{config?.contactPhone}</a>
              </div>
              <div className={buttonsClass}>
                <Button
                  styleClass="uppercase text-amber-50 px-4 py-2"
                  type={ButtonType.BUTTON}
                  callback={() => dispatch(setRequestCallPopupVisible(true))}
                >{TRANSLATES[LOCALE].requestCall}</Button>
                <a className={instagramClass}
                   href="https://www.instagram.com/prof_vik.elise/"
                   target="_blank"
                >
                  <Image className="p-2" width={40} height={40} src="/icons/instagram.svg" alt="Instagram"/>
                </a>
              </div>
            </div>
        }
        <div className="text-xs text-center py-4">© 2023 prof-elise.by - Расходные материалы в Могилеве</div>
      </ContentContainer>
    </footer>
  );
}