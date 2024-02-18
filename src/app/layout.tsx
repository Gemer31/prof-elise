import { Open_Sans } from 'next/font/google';
import './globals.css';
import { IFirebaseDocumentModel } from '@/app/models';
import StoreProvider from '@/store/StoreProvider';
import { Layout } from '@/components/Layout';
import 'animate.css';
import { collection, getDocs } from '@firebase/firestore';
import { Metadata } from 'next';
import { listAll, ref } from '@firebase/storage';
import { db, storage } from '@/app/lib/firebase-config';
import { cookies } from 'next/headers';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Одноразовая продукция и расходные материалы для салонов и медицинских учреждений в Могилеве',
  description: 'Расходные материалы в Могилеве'
};

export default async function RootLayout({children, params}: {
  children: React.ReactNode;
  params: {
    docs: IFirebaseDocumentModel[]
  };
}) {
  const [firestoreData, storageData, loginCheckResponse] = await Promise.all([
    getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
    listAll(ref(storage)),
    fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/login`, {
      headers: {
        Cookie: `session=${cookies().get('session')?.value}`
      },
    })
  ]);

  return (
    <html id="html" lang="en" className="scroll-smooth">
    <body className={openSans.className}>
    <StoreProvider>
      <Layout
        firestoreDocsData={JSON.parse(JSON.stringify(firestoreData?.docs))}
        storageData={JSON.parse(JSON.stringify(storageData.items))}
      >
        {children}
      </Layout>
    </StoreProvider>
    </body>
    </html>
  );
}
