import { AboutUs } from '@/components/view/AboutUs';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CategoriesList } from '@/components/view/CategoriesList';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { ICategory, IConfig, IViewedRecently } from '@/app/models';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/view/slider/Slider';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { cookies } from 'next/headers';
import { SubHeader } from '@/components/view/SubHeader';

export interface IHomePageProps {
  searchParams: {
    pageLimit: number;
  };
}

export default async function HomePage({searchParams: {pageLimit}}: IHomePageProps) {
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
    <Slider/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <article className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center text-2xl uppercase">{TRANSLATES[LOCALE].popularCategories}</h2>
          <Button styleClass="flex px-4 py-2" href={RouterPath.CATEGORIES}>{TRANSLATES[LOCALE].allCategories}</Button>
        </div>
        <CategoriesList itemsLimit={6} data={Object.values(categories)} pageLimit={Number(pageLimit)}/>
      </article>
      <AboutUs text={config.shopDescription}/>
    </ContentContainer>
    <ViewedRecently viewedRecently={viewedRecently} config={config}/>
  </>;
}
