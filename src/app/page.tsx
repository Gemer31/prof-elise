import { Advantages } from '@/components/Advantages';
import { Categories } from '@/components/categories/Categories';
import { EntityCard } from '@/components/EntityCard';
import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields } from '@/app/models';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { collection, getDocs } from '@firebase/firestore';
import { db, storage } from '@/utils/firebaseModule';
import { AboutUs } from '@/components/AboutUs';
import { FirebaseCollections } from '@/app/enums';
import { convertCategoriesDataToModelArray, convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { listAll, ref } from '@firebase/storage';

export default async function HomePage() {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, FIREBASE_DATABASE_NAME)),
    listAll(ref(storage))
  ]);
  const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.CATEGORIES
  ));
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12 mr-4">
          <Categories categories={categories}/>
          <Advantages/>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {
            categories?.map((category) => (<EntityCard key={category.id} category={category} config={config}/>))
          }
        </div>
      </div>
      <AboutUs text={config.shopDescription}/>
    </main>
  );
}
