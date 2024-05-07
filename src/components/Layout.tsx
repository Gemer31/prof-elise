'use client';

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ICategory, ICommonProps, IConfig, IProduct } from '@/app/models';
import { Notification } from '@/components/Notification';
import { ContentContainer } from '@/components/ContentContainer';
import { StorageReference } from '@firebase/storage';
import { SubHeader } from '@/components/SubHeader';
import { Slider } from '@/components/slider/Slider';
import { usePathname } from 'next/navigation';
import { RouterPath } from '@/app/enums';

export interface ILayoutProps extends ICommonProps {
  firestoreData?: {
    config: IConfig;
    categories: ICategory[];
    products: IProduct[];
  };
  storageData?: StorageReference[];
}

export function Layout({children, firestoreData}: ILayoutProps) {
  const pathname = usePathname();

  return (
    <>
      <RequestCallPopup/>
      <Notification/>
      <div id="page" className="relative flex flex-col items-center h-full z-10">
        <Header products={firestoreData?.products}/>
        <SubHeader config={firestoreData?.config}/>
        {pathname === RouterPath.HOME ? <Slider/> : <></>}
        <ContentContainer id="content" styleClass="w-full flex justify-start px-2">
          {children}
        </ContentContainer>
        <Footer config={firestoreData?.config}/>
      </div>
    </>
  );
}