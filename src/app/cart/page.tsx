import { Metadata } from 'next';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { IConfig } from '@/app/models';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { IClient } from '@/store/dataSlice';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export default async function CartPage() {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  if (!clientId?.length) {
    redirect(RouterPath.HOME);
  }

  const [clientDocumentSnapshot, settingsQuerySnapshot] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    getDocs(collection(db, FirestoreCollections.SETTINGS))
  ]);
  const client: IClient = clientDocumentSnapshot.data() as IClient;
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;


  return <main className="w-full">
    {/*<CartTable editable={true} config={config} title={TRANSLATES[LOCALE].purchaseCart}/>*/}
  </main>;
}