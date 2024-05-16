import { Metadata } from 'next';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { ButtonTypes, FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { IClient, IConfig, IViewedRecently } from '@/app/models';
import { BasePage } from '@/components/BasePage';
import { ContentContainer } from '@/components/ContentContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { getViewedRecently } from '@/utils/firebase.util';
import { CheckoutForm } from '@/components/checkout-form/CheckoutForm';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { CheckoutTotalBar } from '@/components/checkout-form/CheckoutTotalBar';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Расходные материалы в Могилеве'
};

export default async function CheckoutPage() {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  const [
    clientDocumentSnapshot,
    settingsDocumentSnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG))
  ]);
  const client: IClient = clientDocumentSnapshot.data() as IClient;
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  return <BasePage viewedRecently={viewedRecently} config={config}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].orderCreation}
      ]}/>
      <div className="w-full">
        <div className="w-full flex justify-between mb-2">
          <h1 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].orderCreation}</h1>
          <Button type={ButtonTypes.BUTTON}>
            <Link className="flex px-4 py-2" href={RouterPath.CART}>{TRANSLATES[LOCALE].returnToCart}</Link>
          </Button>
        </div>
        <div className="w-full flex gap-x-4">
          <CheckoutForm config={config}/>
          <CheckoutTotalBar config={config}/>
        </div>
      </div>
    </ContentContainer>
  </BasePage>;
}