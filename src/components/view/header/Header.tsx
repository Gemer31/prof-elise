'use client';

import Link from 'next/link';
import { CartButton } from '@/components/view/CartButton';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { usePathname } from 'next/navigation';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FavouritesButton } from '@/components/view/FavouritesButton';
import { CircleButton } from '@/components/ui/CircleButton';
import { SITE_HEADER_LINKS } from '@/app/constants';
import { SessionProvider } from 'next-auth/react';
import { HeaderAuthActions } from '@/components/view/header/HeaderAuthActions';

export function Header() {
  const pathname = usePathname();
  const burgerRef = useRef<HTMLInputElement>(null);
  const [isScrollTop, setIsScrollTop] = useState(true);

  const hostClass: string = useMemo(() => convertToClass([
    'w-full',
    'z-20',
    'top-0',
    'sticky',
    'flex',
    'justify-center',
    'bg-pink-300',
    'mb-4',
    'transition-shadow',
    'duration-500',
    isScrollTop ? '' : 'shadow-lg'
  ]), [isScrollTop]);
  const navLinkClass: string = useMemo(() => convertToClass([
    'flex',
    'items-center',
    'px-4',
    'py-2',
    'hover:bg-pink-200',
    'duration-500',
    'transition-colors',
    'text-lg'
  ]), []);
  const navSidebarLinkClass: string = useMemo(() => convertToClass([
    'flex',
    'items-center',
    'justify-center',
    'px-4',
    'py-2',
    'hover:text-pink-200',
    'duration-500',
    'transition-colors',
    'text-2xl',
    'text-amber-50'
  ]), []);

  useEffect(() => {
    window.onscroll = () => {
      const el = (document.documentElement.clientHeight)
        ? document.documentElement
        : document.body;

      setIsScrollTop(el.scrollTop === 0);
    };
  }, []);

  const getNavigationLinkClass = (path: string) => {
    return navLinkClass + (path === pathname ? ' bg-white' : '');
  };
  const getNavigationSidebarLinkClass = (path: string) => {
    return navSidebarLinkClass + (path === pathname ? ' text-pink-500' : '');
  };

  return <header className={hostClass}>
    <CircleButton
      href="#page"
      styleClass={'size-10 shadow-md fixed max-w-fit bottom-6 left-6 duration-500 scale-0 ' + (isScrollTop ? '' : 'scale-100')}>
      <Image width={50} height={50} src="/icons/arrow.svg" alt="Scroll top"/>
    </CircleButton>
    <ContentContainer>
      <nav className="flex justify-between">
        <div className="hidden sm:flex">
          {
            SITE_HEADER_LINKS.map(([path, translateCode]) => (
              <Link
                key={path}
                className={getNavigationLinkClass(path)}
                href={path}
              >{TRANSLATES[LOCALE][translateCode]}</Link>
            ))
          }
        </div>
        <div className="flex sm:hidden burger-container">
          <input ref={burgerRef} className="burger-checkbox" type="checkbox"/>
          <div className="burger-lines">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <aside className="aside-menu-items">
            {
              SITE_HEADER_LINKS.map(([path, translateCode]) => (
                <Link
                  key={path}
                  className={getNavigationSidebarLinkClass(path)}
                  href={path}
                  onClick={() => burgerRef.current?.click()}
                >{TRANSLATES[LOCALE][translateCode]}</Link>
              ))
            }
          </aside>
        </div>
        <div className="flex py-1">
          <CircleButton styleClass="size-14" target="_blank" href="https://www.instagram.com/prof_vik.elise/">
            <Image className="p-2" width={45} height={45} src="/icons/instagram.svg" alt="Instagram"/>
          </CircleButton>
          <CartButton/>
          <FavouritesButton/>
          <SessionProvider>
            <HeaderAuthActions/>
          </SessionProvider>
        </div>
      </nav>
    </ContentContainer>
  </header>;
}