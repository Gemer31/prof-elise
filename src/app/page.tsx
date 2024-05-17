import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CategoriesList } from '@/components/CategoriesList';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { ICategory, IConfig, IViewedRecently } from '@/app/models';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { Button } from '@/components/Button';
import { Slider } from '@/components/slider/Slider';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import { cookies } from 'next/headers';

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
    <Slider/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].popularCategories}</h2>
          <Button styleClass="flex px-4 py-2" href={RouterPath.CATEGORIES}>
            {TRANSLATES[LOCALE].allCategories}
          </Button>
        </div>
        <CategoriesList data={Object.values(categories)} pageLimit={Number(pageLimit)}/>
      </div>
      <AboutUs text={config.shopDescription}/>
    </ContentContainer>
    <ViewedRecently
      viewedRecently={viewedRecently}
      config={config}
    />
  </>;
}
