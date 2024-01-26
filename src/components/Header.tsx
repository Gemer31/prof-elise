'use client';

import Link from 'next/link';
import { Cart } from '@/components/Cart';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ContentContainer } from '@/components/ContentContainer';
import { Search } from '@/components/Search';
import { CONTACT_PHONE, WORKING_TIME } from '@/app/constants';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { LOCALE, TRANSLATES } from '@/app/translates';

export function Header() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const navigationLinkClass: string = convertToClass([
    'flex',
    'items-center',
    'px-4',
    'py-2',
    'hover:bg-pink-200',
    'duration-500',
    'transition-colors'
  ]);
  const instagramClass: string = convertToClass([
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
  ]);

  const getNavigationLinkClass = (path: string) => {
    return navigationLinkClass + (path === pathname ? ' bg-gray-200' : '');
  };

  return (
    <>
      <header className="w-full mb-4 flex flex-col items-center">
        <div className="w-full flex justify-center bg-pink-300">
          <ContentContainer styleClass="flex justify-between">
            <nav className="flex">
              <Link className={getNavigationLinkClass('/')} href="/">{TRANSLATES[LOCALE].main}</Link>
              <Link className={getNavigationLinkClass('/delivery')}
                    href="/delivery">{TRANSLATES[LOCALE].delivery}</Link>
              <Link className={getNavigationLinkClass('/contacts')}
                    href="/contacts">{TRANSLATES[LOCALE].contacts}</Link>
            </nav>
            <div className="flex">
              <a className={instagramClass}
                 href="https://www.instagram.com/prof_vik.elise/"
                 target="_blank"
              >
                <Image className="p-2" width={40} height={40} src="/icons/instagram.svg" alt="Instagram"/>
              </a>
              <Cart/>
            </div>
          </ContentContainer>
        </div>
        <ContentContainer styleClass="flex justify-between items-center pt-4">
          <Link href="/">
            <Image className="rounded-full" width={100} height={100} src="/images/logo.jpg" alt="Instagram"/>
          </Link>
          <div className="uppercase text-center w-20">{TRANSLATES[LOCALE].сonsumables}</div>
          <Search/>
          <div className="text-center">
            <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
            <div>{WORKING_TIME}</div>
          </div>
          <Button
            styleClass="uppercase text-amber-50 px-4 py-2"
            type={ButtonType.BUTTON}
            callback={() => dispatch(setRequestCallPopupVisible(true))}
          >{TRANSLATES[LOCALE].requestCall}</Button>
        </ContentContainer>
      </header>
    </>
  );
}