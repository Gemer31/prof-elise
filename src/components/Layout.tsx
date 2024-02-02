'use client';

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps, IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Notification } from '@/components/Notification';
import { ContentContainer } from '@/components/ContentContainer';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';

export interface LayoutProps extends CommonProps{
  firestoreDocsData?: Array<QueryDocumentSnapshot>;
  storageData?: StorageReference[];
}

export function Layout({ children, firestoreDocsData }: LayoutProps) {
  const requestCallPopupVisible = useAppSelector(
    state => state.dataReducer.requestCallPopupVisible
  );
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreDocsData,
    FirebaseCollections.CONFIG,
  ));

  return (
    <>
      {requestCallPopupVisible ? <RequestCallPopup/> : <></>}
      <Notification/>
      <Header firestoreConfigData={config}/>
      <ContentContainer styleClass="w-full flex justify-start">
        {children}
      </ContentContainer>
      <Footer firestoreConfigData={config}/>
    </>
  )
}