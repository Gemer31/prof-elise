import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps } from '@/app/models';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Prof-Elise',
  description: 'Generated by create next app'
};

export default function RootLayout({children}: CommonProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
    <body className={'flex flex-col items-center h-full overflow-x-hidden bg-gray-200 ' + openSans.className}>
    {/*<Notification message={'Спасибо за заявку!\nНаши операторы вам перезвонят'} styleClass={notificationVisibleClass}/>*/}
    <Header/>
    {children}
    <Footer/>
    </body>
    </html>
  );
}
