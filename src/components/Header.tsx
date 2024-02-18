'use client';

import Link from 'next/link';
import { CartButton } from '@/components/CartButton';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ContentContainer } from '@/components/ContentContainer';
import { usePathname, useRouter } from 'next/navigation';
import { RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from '@firebase/auth';
import { IConfig, IProduct } from '@/app/models';
import { useMemo, useRef } from 'react';
import path from 'path';
import { auth } from '@/app/lib/firebase-config';

export interface IHeaderProps {
  config?: IConfig;
  firestoreProductsData?: IProduct[];
}

export function Header({config, firestoreProductsData}: IHeaderProps) {
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
    'text-amber-50',
  ]), []);
  const circleNavLinkClass: string = useMemo(() => convertToClass([
    'cursor-pointer',
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-amber-50',
    'm-1',
    'size-14',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors',
  ]), []);
  const siteLinks: string[][] = useMemo(() => ([
    [RouterPath.HOME, 'main'],
    [RouterPath.DELIVERY, 'delivery'],
    [RouterPath.CONTACTS, 'contacts']
  ]), []);

  const router = useRouter();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const burgerRef = useRef<HTMLInputElement>(null);

  const getNavigationLinkClass = (path: string) => {
    return navLinkClass + (path === pathname ? ' bg-gray-200' : '');
  };
  const getNavigationSidebarLinkClass = (path: string) => {
    return navSidebarLinkClass + (path === pathname ? ' text-pink-500' : '');
  };

  const logout = async () => {
    await signOut(auth);
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/logout`, {
      method: 'POST'
    });
    if (response.status === 200 && pathname === RouterPath.EDITOR) {
      router.push(RouterPath.HOME);
    }
  };

  return (
    <header className="w-full z-10 top-0 sticky flex justify-center bg-pink-300 mb-4">
      <ContentContainer>
        <nav className="flex justify-between">
          <div className="hidden sm:flex">
            {
              siteLinks.map(([path, translateCode]) => (
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
                siteLinks.map(([path, translateCode]) => (
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
            <a className={circleNavLinkClass}
               href="https://www.instagram.com/prof_vik.elise/"
               target="_blank"
            >
              <Image className="p-2" width={45} height={45} src="/icons/instagram.svg" alt="Instagram"/>
            </a>
            <CartButton firestoreProductsData={firestoreProductsData}/>
            {
              user
                ? <>
                  <Link href={RouterPath.EDITOR} className={circleNavLinkClass}>
                    <Image className="p-2" width={45} height={45} src="/icons/edit.svg" alt="Home"/>
                  </Link>
                  <div className={circleNavLinkClass} onClick={logout}>
                    <Image className="p-2" width={45} height={45} src="/icons/logout.svg" alt="Home"/>
                  </div>
                </>
                : <></>
            }
          </div>
        </nav>
      </ContentContainer>
    </header>
  );
}