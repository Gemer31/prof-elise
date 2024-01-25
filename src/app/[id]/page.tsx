import { Category, Product } from '@/app/models';
import { CATEGORIES, PRODUCTS_BY_CATEGORY_ID } from '@/app/constants';
import { EntityCard } from '@/components/EntityCard';
import { Categories } from '@/components/categories/Categories';
import { Advantages } from '@/components/Advantages';

export interface CategoriesOrProductsProps {
  params: {
    id: string;
  };
}

async function getCategories(id: string): Promise<Category[] | undefined> {
  // TODO: request
  return CATEGORIES.find((category) => category.id === id)?.categories || undefined;
}

async function getProducts(id: string): Promise<Product[] | undefined> {
  // TODO: request
  return PRODUCTS_BY_CATEGORY_ID[id];
}

export default async function CategoriesOrProducts({params: {id}}: CategoriesOrProductsProps) {
  const categories: Category[] | undefined = await getCategories(id);
  const products: Product[] | undefined = await getProducts(id);

  return (
    <div className="w-full flex justify-between">
      <div className="w-4/12">
        <Categories/>
        <Advantages/>
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {
          categories?.length
            ? categories.map((category) => (<EntityCard key={category.id} category={category}/>))
            : products?.map((product) => (<EntityCard key={product.id} category={product}/>))
        }
      </div>
    </div>
  );
}

