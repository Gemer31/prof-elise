import { Open_Sans } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import { Layout } from '@/components/Layout';
import 'animate.css';
import { Metadata } from 'next';
import { listAll, ref } from '@firebase/storage';
import { storage } from '@/app/lib/firebase-config';
import { getFirestoreData } from '@/app/lib/firebase-api';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Одноразовая продукция и расходные материалы для салонов и медицинских учреждений в Могилеве',
  description: 'Расходные материалы в Могилеве'
};

export default async function RootLayout({children}: {
  children: React.ReactNode;
}) {
  const [firestoreData, storageData] = await Promise.all([
    getFirestoreData(),
    listAll(ref(storage)),
  ]);

  return (
    <html id="html" lang="en" className="scroll-smooth">
    <body className={openSans.className}>
    <StoreProvider>
      <Layout
        firestoreData={firestoreData}
        storageData={JSON.parse(JSON.stringify(storageData.items))}
      >
        {children}
      </Layout>
    </StoreProvider>
    </body>
    </html>
  );
}
