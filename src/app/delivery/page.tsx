import { ContentContainer } from '@/components/ContentContainer';
import { IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';

export default async function DeliveryPage() {
  const firestoreData = await getDocs(
    collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))
  );
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG,
  ));

  return (
    <main className="w-full ql-editor no-paddings">
      <ContentContainer>
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{__html: config.deliveryDescription}}
        />
      </ContentContainer>
    </main>
  )
}