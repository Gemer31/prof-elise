import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommonProps } from '@/app/models';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Prof-Elise',
  description: 'Generated by create next app'
};

export default function RootLayout({children}: CommonProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
    <body className="flex flex-col items-center h-full text-custom-black-50 bg-custom-gray-50 overflow-x-hidden">
    <Header/>
    {children}
    <Footer/>
    </body>
    </html>
  );
}
