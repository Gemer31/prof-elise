'use client'

import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps } from '@/app/models';
import { useAppSelector } from '@/store/store';
import { Notification } from '@/components/Notification';
import { Advantages } from '@/components/Advantages';
import { ContentContainer } from '@/components/ContentContainer';
import { AboutUs } from '@/components/AboutUs';

export interface LayoutProps extends CommonProps{
  isAboutUs: boolean;
}

export function Layout({ children, isAboutUs }: LayoutProps) {
  const requestCallPopupVisible = useAppSelector(
    state => state.dataReducer.requestCallPopupVisible
  );

  return (
    <>
      {requestCallPopupVisible ? <RequestCallPopup/> : <></>}
      <Notification/>
      <Header/>
      <ContentContainer styleClass="w-full flex justify-start">
        <Advantages/>
        {children}
      </ContentContainer>
      {
        isAboutUs
          ? <AboutUs/>
          : <></>
      }
      <Footer/>
    </>
  )
}