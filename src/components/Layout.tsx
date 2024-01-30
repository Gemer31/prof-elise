'use client';

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Notification } from '@/components/Notification';
import { ContentContainer } from '@/components/ContentContainer';
import { QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore';

export interface LayoutProps extends CommonProps{
  firestoreData?: Array<QueryDocumentSnapshot>;
}

export function Layout({ children, firestoreData }: LayoutProps) {
  const requestCallPopupVisible = useAppSelector(
    state => state.dataReducer.requestCallPopupVisible
  );

  return (
    <>
      {requestCallPopupVisible ? <RequestCallPopup/> : <></>}
      <Notification/>
      <Header/>
      <ContentContainer styleClass="w-full flex justify-start">
        {children}
      </ContentContainer>
      <Footer firestoreData={firestoreData}/>
    </>
  )
}