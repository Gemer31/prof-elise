import { Open_Sans } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import 'animate.css';
import { Metadata } from 'next';
import { RequestCallPopup } from '@/components/view/RequestCallPopup';
import { Notification } from '@/components/ui/Notification';
import { Header } from '@/components/view/Header';
import { SubHeader } from '@/components/view/SubHeader';
import { Slider } from '@/components/view/slider/Slider';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { Footer } from '@/components/view/Footer';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { IClient, IConfig } from '@/app/models';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Одноразовая продукция и расходные материалы для салонов и медицинских учреждений в Могилеве',
  description: 'Расходные материалы в Могилеве'
};

export default async function RootLayout({children}: {
  children: React.ReactNode;
}) {
  const [
    settingsDocumentSnapshot,
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;

  return (
    <html id="html" lang="en" className="scroll-smooth">
    <body className={'overflow-x-hidden ' + openSans.className}>
    <StoreProvider>
      <RequestCallPopup/>
      <Notification/>
      <div id="page" className="relative flex flex-col items-center h-full z-10">
        <Header/>
        <main className="w-full flex flex-col items-center">
          {children}
        </main>
        <Footer config={config}/>
      </div>
    </StoreProvider>
    </body>
    </html>
  );
}
