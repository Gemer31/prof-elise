import { Open_Sans } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import { Layout } from '@/components/Layout';
import 'animate.css';
import { Metadata } from 'next';
import { listAll, ref } from '@firebase/storage';
import { db, storage } from '@/app/lib/firebase-config';
import { getConfig } from '@/app/lib/firebase-api';
import { collection, getDocs } from '@firebase/firestore';
import { FirebaseCollections } from '@/app/enums';
import { docsToData } from '@/utils/firebase.util';
import { ICategory } from '@/app/models';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Одноразовая продукция и расходные материалы для салонов и медицинских учреждений в Могилеве',
  description: 'Расходные материалы в Могилеве'
};

export default async function RootLayout({children}: {
  children: React.ReactNode;
}) {
  const [config, categoriesQuerySnapshot, storageData] = await Promise.all([
    getConfig(),
    getDocs(collection(db, FirebaseCollections.CATEGORIES)),
    listAll(ref(storage))
  ]);

  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  return (
    <html id="html" lang="en" className="scroll-smooth">
    <body className={'overflow-x-hidden ' + openSans.className}>
    <StoreProvider>
      <Layout
        firestoreData={{config, categories: Object.values(categories)}}
        storageData={JSON.parse(JSON.stringify(storageData.items))}
      >
        {children}
      </Layout>
    </StoreProvider>
    </body>
    </html>
  );
}
