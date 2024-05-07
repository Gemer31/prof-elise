import { Advantages } from '@/components/Advantages';
import { Catalog } from '@/components/Catalog';
import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getFirestoreData } from '@/app/lib/firebase-api';
import { CategoriesList } from '@/components/CategoriesList';

export default async function HomePage() {
  const {config, categories} = await getFirestoreData();

  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full md:w-4/12 gap-x-3 my-6">
            <Catalog categories={categories}/>
            <Advantages/>
          </div>
          <div className="w-full">
            <h2 className="text-center text-xl uppercase mb-4">{TRANSLATES[LOCALE].disposableConsumables}</h2>
            <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoriesList data={categories}/>
            </div>
          </div>
        </div>
        <AboutUs text={config.shopDescription}/>
      </ContentContainer>
    </main>
  );
}
