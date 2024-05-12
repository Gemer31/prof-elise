import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { FavouritesList } from '@/components/FavouritesList';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { ICategory } from '@/app/models';
import { docsToData } from '@/utils/firebase.util';

export default async function FavouritesPage() {
  const categoriesQuerySnapshot = await getDocs(collection(db, FirestoreCollections.CATEGORIES));
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  return (
    <div className="">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].favouriteProducts}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={categories}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full">
          <FavouritesList/>
        </div>
      </div>
    </div>
  );
}