import { ICategory, IConfig, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductsList } from '@/components/ProductsList';
import { FirestoreCollections, PageLimits, RouterPath } from '@/app/enums';
import { collection, doc, getDocs, orderBy, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { redirect } from 'next/navigation';
import { BasePage } from '@/components/BasePage';
import chunk from 'lodash.chunk';
import { CategoriesList } from '@/components/CategoriesList';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { ContentContainer } from '@/components/ContentContainer';

export interface ICategoriesPageProps {
  searchParams: {
    pageLimit: number;
  };
}

export default async function CategoriesPage(
  {searchParams: {pageLimit}}: ICategoriesPageProps
) {
  const [
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  return <BasePage sliderVisible={false} config={config}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].catalog}]}/>
      <h1 className="text-2xl self-start uppercase py-2">{TRANSLATES[LOCALE].productsCatalog}</h1>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <CategoriesList data={categories} pageLimit={pageLimit}/>
      </div>
    </ContentContainer>
  </BasePage>;
}

