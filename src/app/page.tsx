import { Advantages } from '@/components/Advantages';
import { Catalog } from '@/components/Catalog';
import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CategoriesList } from '@/components/CategoriesList';
import { docsToData } from '@/utils/firebase.util';
import { ICategory, IConfig } from '@/app/models';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { BasePage } from '@/components/BasePage';

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
      <main>
          <ContentContainer styleClass="flex flex-col items-center px-2">
              <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
                  <div className="w-full gap-x-3 md:w-4/12 mr-4">
                      <Catalog pageLimit={pageLimit} categories={Object.values(categories)}/>
                      <Advantages/>
                  </div>
                  <div className="w-full">
                      <h2 className="text-center text-xl uppercase mb-4">{TRANSLATES[LOCALE].disposableConsumables}</h2>
                      <CategoriesList data={Object.values(categories)} pageLimit={Number(pageLimit)}/>
                  </div>
              </div>
              <AboutUs text={config.shopDescription}/>
          </ContentContainer>
      </main>
  </BasePage>
}
