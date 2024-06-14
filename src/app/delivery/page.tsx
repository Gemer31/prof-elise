import { ContentContainer } from '@/components/ui/ContentContainer';
import { IConfig } from '@/app/models';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';

export default async function DeliveryPage() {
  const settingsDocumentSnapshot = await getDoc(
    doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)
  );
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;

  return (
    <>
      <SubHeader config={config} />
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <Breadcrumbs links={[{ title: TRANSLATES[LOCALE].delivery }]} />
        <article
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: config.deliveryDescription }}
        />
      </ContentContainer>
      <ViewedRecently />
    </>
  );
}
