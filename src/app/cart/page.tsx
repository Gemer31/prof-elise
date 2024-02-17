import { FirebaseCollections } from '@/app/enums';
import { IConfig } from '@/app/models';
import { CartTable } from '@/components/CartTable';
import { Metadata } from 'next';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getFirebaseData } from '@/app/lib/firebase-api';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export default async function CartPage() {
  const config: IConfig = await getFirebaseData<IConfig>(FirebaseCollections.CONFIG);
  return (
    <main className="w-full">
      <h2 className="my-4 text-center sm:text-start text-2xl">{TRANSLATES[LOCALE].purchaseCart}</h2>
      <CartTable editable={true} firestoreConfigData={config}/>
    </main>
  );
}