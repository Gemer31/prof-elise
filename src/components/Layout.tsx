'use client';

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ICommonProps, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';
import { Notification } from '@/components/Notification';
import { ContentContainer } from '@/components/ContentContainer';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { convertConfigDataToModel, convertProductsDataToModelArray, getDocData } from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';
import { SubHeader } from '@/components/SubHeader';

export interface ILayoutProps extends ICommonProps {
  firestoreDocsData?: Array<QueryDocumentSnapshot>;
  storageData?: StorageReference[];
}

export function Layout({children, firestoreDocsData}: ILayoutProps) {
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreDocsData,
    FirebaseCollections.CONFIG
  ));
  const products: IProduct[] = convertProductsDataToModelArray(getDocData<IFirestoreFields>(
    firestoreDocsData,
    FirebaseCollections.PRODUCTS
  ));

  return (
    <>
      <RequestCallPopup/>
      <Notification/>
      <div id="page" className="relative flex flex-col items-center h-full bg-gray-200 z-10">
        <Header config={config} firestoreProductsData={products}/>
        <SubHeader config={config}/>
        <ContentContainer id="content" styleClass="w-full flex justify-start px-2">
          {children}
        </ContentContainer>
        <Footer config={config}/>
      </div>
    </>
  );
}