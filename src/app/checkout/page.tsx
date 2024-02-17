import { CheckoutForm } from '@/components/CheckoutForm';
import { Metadata } from 'next';
import { getFirestoreData } from '@/app/lib/firebase-api';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Расходные материалы в Могилеве'
};

export default async function CheckoutPage() {
  const {config} = await getFirestoreData();
  return (
    <main className="w-full h-full">
      <CheckoutForm config={config}/>
    </main>
  );
}