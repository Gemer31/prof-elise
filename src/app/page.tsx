import { Advantages } from '@/components/Advantages';
import { Catalog } from '@/components/Catalog';
import { EntityCard } from '@/components/EntityCard';
import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields } from '@/app/models';
import { collection, getDocs } from '@firebase/firestore';
import { AboutUs } from '@/components/AboutUs';
import { FirebaseCollections } from '@/app/enums';
import { convertCategoriesDataToModelArray, convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { listAll, ref } from '@firebase/storage';
import { ContentContainer } from '@/components/ContentContainer';
import { db, storage } from '@/app/lib/firebase-config';
import { LOCALE, TRANSLATES } from '@/app/translates';

export default async function HomePage() {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
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
    <main>
      <ContentContainer styleClass="flex flex-col items-center overflow-hidden px-2">
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full md:w-4/12 mr-4 my-6">
            <Catalog categories={categories}/>
            <Advantages/>
          </div>
          <div className="w-full">
            <h2 className="text-center text-xl uppercase mb-4">{TRANSLATES[LOCALE].disposableConsumables}</h2>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
              {
                categories?.map((category: ICategory) => (<EntityCard key={category.id} category={category} config={config}/>))
              }
            </div>
          </div>
        </div>
        <AboutUs text={config.shopDescription}/>
      </ContentContainer>
    </main>
  );
}
