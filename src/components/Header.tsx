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
import { useEffect, useMemo, useRef, useState } from 'react';
import { auth } from '@/app/lib/firebase-config';
import { FavouritesButton } from '@/components/FavouritesButton';
import { uuidv4 } from '@firebase/util';
import { getClient, updateClient } from '@/store/asyncThunk';
import { useAppDispatch } from '@/store/store';
import { CLIENT_ID } from '@/app/constants';
import { CircleButton } from '@/components/CircleButton';

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const burgerRef = useRef<HTMLInputElement>(null);
  const [isScrollTop, setIsScrollTop] = useState(true);

  const hostClass: string = useMemo(() => convertToClass([
    'w-full',
    'z-10',
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
  const siteLinks: string[][] = useMemo(() => ([
    [RouterPath.HOME, 'main'],
    [RouterPath.DELIVERY, 'delivery'],
    [RouterPath.CONTACTS, 'contacts']
  ]), []);

  useEffect(() => {
    let clientId: string = localStorage?.getItem(CLIENT_ID) as string;

    if (clientId) {
      dispatch(getClient(clientId));
    } else {
      clientId = uuidv4();
      localStorage.setItem(CLIENT_ID, clientId);
      dispatch(updateClient({
        clientId,
        data: {
          cart: {},
          favourites: {},
          viewedRecently: {}
        }
      }));
    }
  }, []);

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

  const logout = async () => {
    await signOut(auth);
    pathname === RouterPath.EDITOR && router.push(RouterPath.HOME);
    // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/logout`, {
    //   method: 'POST'
    // });
    // if (response.status === 200 && pathname === RouterPath.EDITOR) {
    //   router.push(RouterPath.HOME);
    // }
  };

  return (
    <header className={hostClass}>
      <CircleButton
        href="#page"
        styleClass={'size-6 fixed max-w-fit bottom-6 left-6 duration-500 transition-all ' + (isScrollTop ? 'scale-0' : 'scale-100')}>
        <Image width={80} height={80} src="/icons/arrow.svg" alt="Scroll top"/>
      </CircleButton>
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
            <CircleButton styleClass="size-14" target="_blank" href="https://www.instagram.com/prof_vik.elise/">
              <Image className="p-2" width={45} height={45} src="/icons/instagram.svg" alt="Instagram"/>
            </CircleButton>
            <CartButton/>
            <FavouritesButton/>
            {
              user
                ? <>
                  <CircleButton styleClass="size-14" href={RouterPath.EDITOR}>
                    <Image className="p-2" width={45} height={45} src="/icons/edit.svg" alt="Home"/>
                  </CircleButton>
                  <CircleButton styleClass="size-14" onClick={logout}>
                    <Image className="p-2" width={45} height={45} src="/icons/logout.svg" alt="Home"/>
                  </CircleButton>
                </>
                : <></>
            }
          </div>
        </nav>
      </ContentContainer>
    </header>
  );
}