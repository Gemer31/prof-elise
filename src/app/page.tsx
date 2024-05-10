import { Advantages } from '@/components/Advantages';
import { Catalog } from '@/components/Catalog';
import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getCategories, getConfig, getProductsV2 } from '@/app/lib/firebase-api';
import { CategoriesList } from '@/components/CategoriesList';

export default async function HomePage() {
  const [config, categories, products] = await Promise.all([
    getConfig(),
    getCategories(),
    getProductsV2(),
  ]);

  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full gap-x-3 md:w-4/12 mr-4">
            <Catalog categories={Object.values(categories)}/>
            <Advantages/>
          </div>
          <div className="w-full">
            <h2 className="text-center text-xl uppercase mb-4">{TRANSLATES[LOCALE].disposableConsumables}</h2>
            <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoriesList data={Object.values(categories)}/>
            </div>
          </div>
        </div>
        <AboutUs text={config.shopDescription}/>
      </ContentContainer>
    </main>
  );
}
