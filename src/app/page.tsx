import { Advantages } from '@/components/Advantages';
import { Catalog } from '@/components/Catalog';
import { EntityCard } from '@/components/EntityCard';
import { ICategory, IConfig } from '@/app/models';
import { AboutUs } from '@/components/AboutUs';
import { FirebaseCollections } from '@/app/enums';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getFirebaseData } from '@/app/lib/firebase-api';

export default async function HomePage() {
  const [config, categories] = await Promise.all([
    getFirebaseData<IConfig>(FirebaseCollections.CONFIG),
    getFirebaseData<ICategory[]>(FirebaseCollections.CATEGORIES)
  ]);

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
            <div className="w-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 gap-4">
              {
                categories?.map((category: ICategory) => (
                  <EntityCard key={category.id} category={category} config={config}/>))
              }
            </div>
          </div>
        </div>
        <AboutUs text={config.shopDescription}/>
      </ContentContainer>
    </main>
  );
}
