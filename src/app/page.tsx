import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CategoriesList } from '@/components/CategoriesList';
import { docsToData } from '@/utils/firebase.util';
import { ICategory, IConfig } from '@/app/models';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { ButtonTypes, FirestoreCollections, RouterPath } from '@/app/enums';
import { BasePage } from '@/components/BasePage';
import { Button } from '@/components/Button';
import Link from 'next/link';

export interface IHomePageProps {
  searchParams: {
    pageLimit: number;
  };
}

export default async function HomePage({searchParams: {pageLimit}}: IHomePageProps) {
  const [
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  return <BasePage config={config} sliderVisible={true}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].popularCategories}</h2>
          <Button type={ButtonTypes.BUTTON}>
            <Link className="flex px-4 py-2" href={RouterPath.CATEGORIES}>{TRANSLATES[LOCALE].allCategories}</Link>
          </Button>
        </div>
        <CategoriesList data={Object.values(categories)} pageLimit={Number(pageLimit)}/>
      </div>
      {/*<Advantages/>*/}
      <AboutUs text={config.shopDescription}/>
    </ContentContainer>
  </BasePage>;
}
