'use client';

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';
import { Notification } from '@/components/Notification';
import { ContentContainer } from '@/components/ContentContainer';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { convertConfigDataToModel, convertProductsDataToModelArray, getDocData } from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';
import { SubHeader } from '@/components/SubHeader';

export interface LayoutProps extends CommonProps {
  firestoreDocsData?: Array<QueryDocumentSnapshot>;
  storageData?: StorageReference[];
}

export function Layout({children, firestoreDocsData}: LayoutProps) {
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
      <div className="relative flex flex-col items-center h-full overflow-hidden bg-gray-200 z-10">
        <Header firestoreConfigData={config} firestoreProductsData={products}/>
        <SubHeader firestoreConfigData={config}/>
        <ContentContainer styleClass="w-full flex justify-start px-2">
          {children}
        </ContentContainer>
        <Footer firestoreConfigData={config}/>
      </div>
    </>
  );
}