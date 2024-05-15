import { ContentContainer } from '@/components/ContentContainer';
import { IConfig } from '@/app/models';
import { FirestoreCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { BasePage } from '@/components/BasePage';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';

export default async function DeliveryPage() {
  const settingsQuerySnapshot = await getDocs(collection(db, FirestoreCollections.SETTINGS));
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;

  return <BasePage config={config}>
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