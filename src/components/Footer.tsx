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
import { CircleButton } from '@/components/CircleButton';

export interface IFooterProps {
  config?: IConfig;
}

const PAYMENTS_IMGs = ['belkart.svg', 'erip.svg', 'visa.svg'];

export function Footer({config}: IFooterProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const infoClass: string = useMemo(() => convertToClass([
    'flex',
    'flex-col sm:flex-row',
    'justify-between',
    'pt-4'
  ]), []);
  const buttonsClass: string = useMemo(() => convertToClass([
    'flex',
    'flex-row-reverse sm:flex-col',
    'justify-around',
    'items-center',
    'basis-1/3',
  ]), []);

  return (
    <footer className="w-full flex justify-center bg-pink-300">
      <ContentContainer styleClass="px-2">
        {
          pathname === RouterPath.LOGIN || pathname === RouterPath.EDITOR
            ? <></>
            : <div className={infoClass}>
              <div className="mb-4 sm:mb-0 text-xs basis-1/3"
                   dangerouslySetInnerHTML={{__html: config.shopRegistrationDescription}}
              />
              <div className="mb-4 sm:mb-0 flex flex-col items-center basis-1/3">
                <div>
                  {
                    [
                      [RouterPath.HOME, 'main'],
                      [RouterPath.DELIVERY, 'delivery'],
                      [RouterPath.CONTACTS, 'contacts']
                    ].map(([path, translateCode]) => {
                      return <Link
                        className="text-lg"
                        key={path}
                        href={path}
                      >
                        <h2>{TRANSLATES[LOCALE][translateCode]}</h2>
                      </Link>;
                    })
                  }
                </div>
              </div>
              <div className={buttonsClass}>
                <div>
                  <div className="flex items-center gap-x-2">
                    <CircleButton styleClass="size-8" href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
                      <Image className="p-2" width={35} height={35} src="/icons/phone.svg" alt="Phone"/>
                    </CircleButton>
                    <a href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
                      {config?.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <CircleButton styleClass="size-8" href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}>
                      <Image className="p-2" width={35} height={35} src="/icons/clock.svg" alt="Working hours"/>
                    </CircleButton>
                    {config?.workingHours}
                  </div>
                  <div className="flex items-center gap-x-2">
                    <CircleButton styleClass="size-8" target="_blank" href="https://www.instagram.com/prof_vik.elise/">
                      <Image className="p-2" width={45} height={45} src="/icons/instagram.svg" alt="Instagram"/>
                    </CircleButton>
                    <Button
                      styleClass="uppercase text-amber-50 text-sm px-4 py-2"
                      type={ButtonType.BUTTON}
                      callback={() => dispatch(setRequestCallPopupVisible(true))}
                    >{TRANSLATES[LOCALE].requestCall}</Button>
                  </div>
                </div>
              </div>
            </div>
        }
        <div className="flex justify-center gap-x-4 mt-2">
          {
            PAYMENTS_IMGs.map(url => (<Image width={60} height={60} src={`/payments/${url}`} alt={url}/>))
          }
        </div>
        <div className="text-xs text-center py-4">© 2024 prof-elise.by - Расходные материалы в Могилеве</div>
      </ContentContainer>
    </footer>
  );
}