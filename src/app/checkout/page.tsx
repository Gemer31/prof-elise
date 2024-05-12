import { CheckoutForm } from '@/components/CheckoutForm';
import { Metadata } from 'next';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { IConfig } from '@/app/models';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Расходные материалы в Могилеве'
};

export default async function CheckoutPage() {
  const settingsQuerySnapshot = await getDocs(collection(db, FirebaseCollections.SETTINGS));
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;
  return (
    <main className="w-full h-full">
      <CheckoutForm config={config}/>
    </main>
  );
}