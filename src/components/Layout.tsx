'use client'

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Notification } from '@/components/Notification';

export function Layout({ children }: CommonProps) {
  const requestCallPopupVisible = useAppSelector(
    state => state.dataReducer.requestCallPopupVisible
  );
  const notificationMessage = useAppSelector(
    state => state.dataReducer.notificationMessage
  );

  return (
    <>
      {requestCallPopupVisible ? <RequestCallPopup/> : <></>}
      {notificationMessage ? <Notification/> : <></>}
      <Header/>
      {children}
      <Footer/>
    </>
  )
}