import { ICategory, IConfig, IViewedRecently } from '@/app/models';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirestoreCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { CategoriesList } from '@/components/CategoriesList';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { ContentContainer } from '@/components/ContentContainer';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import { cookies } from 'next/headers';
import { SubHeader } from '@/components/SubHeader';

export interface ICategoriesPageProps {
  searchParams: {
    pageLimit: number;
  };
}

export default async function CategoriesPage(
  {searchParams: {pageLimit}}: ICategoriesPageProps
) {
  const [
    client,
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getClient(cookies()),
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].catalog}]}/>
      <h1 className="text-2xl self-start uppercase py-2">{TRANSLATES[LOCALE].productsCatalog}</h1>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <CategoriesList itemsLimit={6} data={categories} pageLimit={pageLimit}/>
      </div>
    </ContentContainer>
    <ViewedRecently
      viewedRecently={viewedRecently}
      config={config}
    />
  </>;
}

