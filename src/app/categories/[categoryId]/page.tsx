import { ICategory, IConfig, IProduct } from '@/app/models';
import { EntityCard } from '@/components/EntityCard';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { FirebaseCollections } from '@/app/enums';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getFirebaseData } from '@/app/lib/firebase-api';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
}

export default async function CategoriesOrProductsPage({params: {categoryId}}: ICategoriesOrProductsProps) {
  const [
    config,
    categories,
    products
  ] = await Promise.all([
    getFirebaseData<IConfig>(FirebaseCollections.CONFIG),
    getFirebaseData<ICategory[]>(FirebaseCollections.CATEGORIES),
    getFirebaseData<IProduct[]>(FirebaseCollections.PRODUCTS)
  ]);
  const currentCategory: ICategory | undefined = categories.find((item) => item.id === categoryId);
  const relatedCategories: ICategory[] = categories.filter((item) => currentCategory?.relatedCategories?.includes(item.id));
  const currentCategoryProducts: IProduct[] | undefined = products.filter((item) => item.categoryId === categoryId);

  return (
    <div className="">
      <Breadcrumbs category={currentCategory}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={categories} currentCategoryId={categoryId}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 gap-4">
          {
            relatedCategories?.length
              ? relatedCategories.map((category) => (
                <EntityCard key={category.id} category={category} config={config}/>))
              : currentCategoryProducts?.map((product) => (<EntityCard key={product.id} product={product} config={config}/>))
          }
        </div>
      </div>
    </div>
  );
}

