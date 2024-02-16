import { ContentContainer } from '@/components/ContentContainer';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { CartTable } from '@/components/CartTable';
import { db } from '@/app/lib/firebase-config';
import { Metadata } from 'next';
import { LOCALE, TRANSLATES } from '@/app/translates';

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
      <h2 className="my-4 text-center sm:text-start text-2xl">{TRANSLATES[LOCALE].purchaseCart}</h2>
      <CartTable editable={true} firestoreConfigData={config}/>
    </main>
  );
}