import { Metadata } from 'next';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { IClient, IClientEnriched, IConfig, IViewedRecently } from '@/app/models';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { redirect } from 'next/navigation';
import { BasePage } from '@/components/BasePage';
import { ContentContainer } from '@/components/ContentContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getClientEnriched, getViewedRecently } from '@/utils/firebase.util';
import { CartList } from '@/components/cart-list/CartList';

export const metadata: Metadata = {
  title: 'Корзина покупок',
  description: 'Расходные материалы в Могилеве'
};

export interface ICartPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
  };
}

export default async function CartPage({searchParams: {pageLimit}}: ICartPageProps) {
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
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);
  const clientEnriched: IClientEnriched = await getClientEnriched(client);

  return <BasePage viewedRecently={viewedRecently} config={config}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].purchaseCart}
      ]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <CartList config={config} serverClient={clientEnriched}/>
      </div>
    </ContentContainer>
  </BasePage>;
}