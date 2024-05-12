import { CartTable } from '@/components/CartTable';
import { Metadata } from 'next';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { IConfig } from '@/app/models';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export default async function CartPage() {
  const settingsQuerySnapshot = await getDocs(collection(db, FirebaseCollections.SETTINGS));
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;

  return <main className="w-full">
    <CartTable editable={true} config={config} title={TRANSLATES[LOCALE].purchaseCart}/>
  </main>;
}