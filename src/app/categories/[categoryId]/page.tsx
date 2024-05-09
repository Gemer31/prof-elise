import { ICategory, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getFirestoreData, getProductsV2 } from '@/app/lib/firebase-api';
import { CategoriesList } from '@/components/CategoriesList';
import { ProductsList } from '@/components/ProductsList';
import { RouterPath } from '@/app/enums';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
}

export default async function CategoriesOrProductsPage({params: {categoryId}}: ICategoriesOrProductsProps) {
  const {config, categories} = await getFirestoreData();
  const products = await getProductsV2();
  const currentCategory: ICategory | undefined = categories.find((item) => item.id === categoryId);
  const relatedCategories: ICategory[] = categories.filter((item) => currentCategory?.relatedCategories?.includes(item.id));
  const currentCategoryProducts: IProduct[] | undefined = Object.values(products).filter((item) => item.categoryId === categoryId);

  return (
    <div className="">
      <Breadcrumbs links={[{title: String(currentCategory?.title), href: `${RouterPath.CATEGORIES}/${currentCategory?.id}`}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={categories} currentCategoryId={categoryId}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            relatedCategories?.length
              ? <CategoriesList data={relatedCategories}/>
              : <ProductsList data={currentCategoryProducts} config={config}/>
          }
        </div>
      </div>
    </div>
  );
}

