import { Advantages } from '@/components/Advantages';
import { Categories } from '@/components/categories/Categories';
import { EntityCard } from '@/components/EntityCard';
import { Category, IFirebaseDocumentModel } from '@/app/models';
import { CATEGORIES, FIREBASE_DATABASE_NAME } from '@/app/constants';
import { collection, getDocs, QuerySnapshot } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { AboutUs } from '@/components/AboutUs';
import { FirebaseCollections } from '@/app/enums';
import { getDocData } from '@/utils/firebase-collections.util';

async function getCategories(): Promise<Category[] | undefined> {
  // TODO: request
  return CATEGORIES;
}

export default async function HomePage() {
  const firestoreData: QuerySnapshot = await getDocs(collection(db, FIREBASE_DATABASE_NAME));
  const categories: Category[] | undefined = await getCategories();

  const aboutText: string = getDocData(firestoreData.docs as unknown as IFirebaseDocumentModel[], FirebaseCollections.CONFIG)
    ?.['shopDescription']?.stringValue as string;

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12 mr-4">
          <Categories/>
          <Advantages/>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {
            categories?.map((category) => (<EntityCard key={category.id} category={category}/>))
          }
        </div>
      </div>
      <AboutUs text={aboutText}/>
    </main>
  );
}
