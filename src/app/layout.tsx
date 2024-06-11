import { Open_Sans } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import 'animate.css';
import { Metadata } from 'next';
import { RequestCallPopup } from '@/components/view/RequestCallPopup';
import { Notification } from '@/components/ui/Notification';
import { Header } from '@/components/view/header/Header';
import { Footer } from '@/components/view/Footer';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { IConfig } from '@/app/models';
import { GlobalComponent } from '@/components/GlobalComponent';

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
      <GlobalComponent/>
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
