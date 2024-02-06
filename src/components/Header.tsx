'use client';

import Link from 'next/link';
import { CartButton } from '@/components/CartButton';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ContentContainer } from '@/components/ContentContainer';
import { Search } from '@/components/Search';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from '@firebase/auth';
import { IConfig, IProduct } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';
import { useMemo } from 'react';
import path from 'path';
import { auth } from '@/app/lib/firebase-config';

export interface HeaderProps {
  firestoreConfigData?: IConfig;
  firestoreProductsData?: IProduct[];
}

export function Header({firestoreConfigData, firestoreProductsData}: HeaderProps) {
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
    'transition-colors'
  ]), []);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  const getNavigationLinkClass = (path: string) => {
    return navLinkClass + (path === pathname ? ' bg-gray-200' : '');
  };

  const logout = async () => {
    await signOut(auth);
    const response = await fetch(path.join(process.cwd(), 'api', 'logout'), {
      method: 'POST'
    });
    if (response.status === 200 && pathname === RouterPath.EDITOR) {
      router.push(RouterPath.MAIN);
    }
  };

  return (
    <>
      <header className="w-full mb-4 flex flex-col items-center">
        <div className="w-full flex justify-center bg-pink-300">
          <ContentContainer styleClass="px-2">
            <nav className="flex justify-between">
              <div className="flex">
                {
                  [
                    [RouterPath.MAIN, 'main'],
                    [RouterPath.DELIVERY, 'delivery'],
                    [RouterPath.CONTACTS, 'contacts']
                  ].map(([path, translateCode]) => (
                    <Link key={path} className={getNavigationLinkClass(path)}
                          href={path}>{TRANSLATES[LOCALE][translateCode]}</Link>
                  ))
                }
              </div>
              <div className="flex">
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
        </div>
        {
          pathname === RouterPath.LOGIN || pathname === RouterPath.EDITOR
            ? <></>
            : <ContentContainer styleClass="flex justify-between items-center pt-4 px-2">
              <Link href="/">
                <Image className="rounded-full" width={100} height={100} src="/images/logo.jpg" alt="Instagram"/>
              </Link>
              <div className="uppercase text-center w-20">{TRANSLATES[LOCALE].сonsumables}</div>
              <Search/>
              <div className="text-center">
                <a
                  href={`tel:${transformPhoneUtil(firestoreConfigData?.contactPhone || '')}`}>{firestoreConfigData?.contactPhone}</a>
                <div>{firestoreConfigData?.workingHours}</div>
              </div>
              <Button
                styleClass="uppercase text-amber-50 px-4 py-2"
                type={ButtonType.BUTTON}
                callback={() => dispatch(setRequestCallPopupVisible(true))}
              >{TRANSLATES[LOCALE].requestCall}</Button>
            </ContentContainer>
        }
      </header>
    </>
  );
}