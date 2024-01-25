import { AboutUs } from '@/components/AboutUs';
import { Advantages } from '@/components/Advantages';
import { Categories } from '@/components/categories/Categories';

export default function HomePage() {
  return (
    <main className="w-full mt-4 max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12">
          <Categories/>
          <Advantages/>
        </div>
      </div>
      <AboutUs/>
    </main>
  );
}
