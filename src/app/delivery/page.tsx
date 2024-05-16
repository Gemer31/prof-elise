import { ContentContainer } from '@/components/ContentContainer';
import { IClient, IConfig, IViewedRecently } from '@/app/models';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { BasePage } from '@/components/BasePage';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getViewedRecently } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';

export default async function DeliveryPage() {
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
        {title: TRANSLATES[LOCALE].delivery}
      ]}/>
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{__html: config.deliveryDescription}}
      />
    </ContentContainer>
  </BasePage>;
}