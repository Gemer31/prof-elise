import { Metadata } from 'next';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { IClientEnriched, IConfig } from '@/app/models';
import { cookies } from 'next/headers';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getClient, getClientEnriched } from '@/utils/firebase.util';
import { CartList } from '@/components/view/cart-list/CartList';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';

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
  const [client, settingsQuerySnapshot] = await Promise.all([
    getClient(cookies()),
    getDocs(collection(db, FirestoreCollections.SETTINGS))
  ]);
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;
  const clientEnriched: IClientEnriched = await getClientEnriched(client);

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].purchaseCart}
      ]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <CartList config={config} serverClient={clientEnriched}/>
      </div>
    </ContentContainer>
    <ViewedRecently/>
  </>;
}