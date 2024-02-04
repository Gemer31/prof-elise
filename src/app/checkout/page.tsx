import { ContentContainer } from '@/components/ContentContainer';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';
import { CheckoutForm } from '@/components/CheckoutForm';

export default async function CheckoutPage() {
  const firestoreData = await getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME)));
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));

  return (
    <main className="w-full">
      <ContentContainer styleClass="px-2">
        <CheckoutForm firestoreConfigData={config}/>
      </ContentContainer>
    </main>
  )
}