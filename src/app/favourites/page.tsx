import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getCategories, getConfig, getProductsV2 } from '@/app/lib/firebase-api';
import { FavouritesList } from '@/components/FavouritesList';

export default async function FavouritesPage() {
  const [config, products] = await Promise.all([
    getConfig(),
    getCategories(),
    getProductsV2()
  ]);

  return (
    <div className="">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].favouriteProducts}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={categories}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
          <FavouritesList config={config} cart={products}/>
        </div>
      </div>
    </div>
  );
}