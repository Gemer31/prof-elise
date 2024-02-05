import { ContentContainer } from '@/components/ContentContainer';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { IConfig, IFirestoreConfigEditorInfo } from '@/app/models';
import { convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { CartTable } from '@/components/CartTable';

export default async function CartPage() {
  const firestoreData = await getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME)));
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));

  return (
    <main className="w-full">
      <ContentContainer styleClass="px-2">
        <CartTable editable={true} firestoreConfigData={config}/>
      </ContentContainer>
    </main>
  );
}