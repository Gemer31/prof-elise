import { ICategory, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getCategories, getConfig, getProductsV2 } from '@/app/lib/firebase-api';
import { ProductsList } from '@/components/ProductsList';
import { RouterPath } from '@/app/enums';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
}

export default async function CategoriesOrProductsPage({params: {categoryId}}: ICategoriesOrProductsProps) {
  const [config, categories, products] = await Promise.all([
    getConfig(),
    getCategories(),
    getProductsV2(),
  ]);
  const currentCategory: ICategory = Object.values(categories).find((item) => item.id === categoryId);
  // const relatedCategories: ICategory[] = categories.filter((item) => currentCategory?.relatedCategories?.includes(item.id));
  const currentCategoryProducts: IProduct[] = Object.values(products).filter((item) => {
    const productCategoryId = item.categoryRef.path.split('/').pop();
    return productCategoryId === categoryId;
  }).map((item) => {
    item.categoryId = item.categoryRef.path.split('/').pop();
    delete item.categoryRef;
    return item;
  });

  return (
    <div className="">
      <Breadcrumbs links={[{title: String(currentCategory?.title), href: `${RouterPath.CATEGORIES}/${currentCategory?.id}`}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={Object.values(categories)} currentCategoryId={categoryId}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            // relatedCategories?.length
            //   ? <CategoriesList data={relatedCategories}/>
            //   : <ProductsList data={currentCategoryProducts} config={config}/>
            <ProductsList data={currentCategoryProducts} config={config}/>
          }
        </div>
      </div>
    </div>
  );
}

