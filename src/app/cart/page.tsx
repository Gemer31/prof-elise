import { CartTable } from '@/components/CartTable';
import { Metadata } from 'next';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getFirestoreData } from '@/app/lib/firebase-api';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export default async function CartPage() {
  const { config } = await getFirestoreData();
  return (
    <main className="w-full">
      <CartTable editable={true} config={config} title={TRANSLATES[LOCALE].purchaseCart}/>
    </main>
  );
}