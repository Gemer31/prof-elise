import { ContentContainer } from '@/components/ContentContainer';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { CartTable } from '@/components/CartTable';
import { db } from '@/app/lib/firebase-config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export default async function CartPage() {
  const firestoreData = await getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME)));
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));

  return (
    <main className="w-full">
      <ContentContainer styleClass="px-2">
        <CartTable editable={true} firestoreConfigData={config}/>
      </ContentContainer>
    </main>
  );
}