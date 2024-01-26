import { AboutUs } from '@/components/AboutUs';
import { Advantages } from '@/components/Advantages';
import { Categories } from '@/components/categories/Categories';
import { EntityCard } from '@/components/EntityCard';
import { Category } from '@/app/models';
import { CATEGORIES } from '@/app/constants';

async function getCategories(): Promise<Category[] | undefined> {
  // TODO: request
  return CATEGORIES;
}

export default async function HomePage() {
  const categories: Category[] | undefined = await getCategories();

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12 mr-4">
          <Categories/>
          <Advantages/>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {
            categories?.map((category) => (<EntityCard key={category.id} category={category}/>))
          }
        </div>
      </div>
      <AboutUs/>
    </main>
  );
}
