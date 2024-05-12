import { ContentContainer } from '@/components/ContentContainer';
import { IConfig } from '@/app/models';
import { FirestoreCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';

export default async function DeliveryPage() {
  const settingsQuerySnapshot = await getDocs(collection(db, FirestoreCollections.SETTINGS))
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;

  return (
    <main className="w-full ql-editor readonly-ql-editor no-paddings">
      <ContentContainer>
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{__html: config.deliveryDescription}}
        />
      </ContentContainer>
    </main>
  );
}