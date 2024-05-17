import { ContentContainer } from '@/components/ContentContainer';
import { IConfig, IViewedRecently } from '@/app/models';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getClient, getViewedRecently } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';

export default async function DeliveryPage() {
  const [
    client,
    settingsDocumentSnapshot
  ] = await Promise.all([
    getClient(cookies()),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].delivery}
      ]}/>
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{__html: config.deliveryDescription}}
      />
    </ContentContainer>
    <ViewedRecently
      viewedRecently={viewedRecently}
      config={config}
    />
  </>;
}