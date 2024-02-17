import { IConfig } from '@/app/models';
import { FirebaseCollections } from '@/app/enums';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Metadata } from 'next';
import { getFirebaseData } from '@/app/lib/firebase-api';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Расходные материалы в Могилеве'
};

export default async function CheckoutPage() {
  const config: IConfig = await getFirebaseData<IConfig>(FirebaseCollections.CONFIG);
  return (
    <main className="w-full">
      <CheckoutForm firestoreConfigData={config}/>
    </main>
  );
}