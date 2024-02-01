import { Open_Sans } from 'next/font/google';
import './globals.css';
import { IFirebaseDocumentModel } from '@/app/models';
import StoreProvider from '@/store/StoreProvider';
import { Layout } from '@/components/Layout';
import 'animate.css';
import { collection, getDocs, QuerySnapshot } from '@firebase/firestore';
import { db, storage } from '@/utils/firebaseModule';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { Metadata } from 'next';
import { listAll, ListResult, ref } from '@firebase/storage';

const openSans = Open_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Prof-Elise',
  description: 'Generated by create next app'
};

export default async function RootLayout({children, params}: {
  children: React.ReactNode;
  params: {
    docs: IFirebaseDocumentModel[]
  };
}) {
  const firestoreData: QuerySnapshot = await getDocs(collection(db, FIREBASE_DATABASE_NAME));
  const storageData: ListResult = await listAll(ref(storage));

  params.docs = firestoreData?.docs as unknown as IFirebaseDocumentModel[];

  return (
    <html lang="en" className="scroll-smooth">
    <body className={'flex flex-col items-center h-full overflow-x-hidden bg-gray-200 ' + openSans.className}>
    <StoreProvider>
      <Layout
        firestoreData={JSON.parse(JSON.stringify(firestoreData?.docs))}
        storageData={JSON.parse(JSON.stringify(storageData.items))}
      >
        {children}
      </Layout>
    </StoreProvider>
    </body>
    </html>
  );
}
