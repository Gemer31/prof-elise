'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/app/models';
import { RouterPath } from '@/app/enums';
import { usePathname } from 'next/navigation';

interface ICategoriesProps {
  categories: ICategory[];
  currentCategoryId?: string | undefined;
}

export function Categories({categories, currentCategoryId}: ICategoriesProps) {
  return (
    <>
      <div className="fixed md:hidden aside-categories-wrapper">
        <input className="categories-checkbox" type="checkbox"/>
        <div className="aside-nav-categories-button-icon">
          <Image width={30} height={30} src="/icons/categories.svg" alt="Categories list"/>
        </div>
        <div className="aside-nav-categories">
          <div className="h-full flex flex-col justify-center text-lg">
            {
              categories.map((category) => {
                return (
                  <Link
                    className={`py-2 hover:text-pink-200 ${currentCategoryId === category.id ? 'text-pink-500' : 'text-amber-50'}`}
                    key={category.id}
                    href={RouterPath.CATEGORIES + '/' + category.id}
                  >
                    <span className={currentCategoryId === category.id ? 'font-bold' : ''}>{category.title}</span>
                  </Link>
                );
              })
            }
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        {
          categories.map((category) => {
            return (
              <Link
                className="flex items-center relative w-full categories-item duration-500 transition-colors hover:bg-pink-100 px-4 py-3"
                key={category.id}
                href={RouterPath.CATEGORIES + '/' + category.id}
              >
                <Image className="mr-4" width={25} height={25} src={category.imageUrl} alt={category.title}/>
                <span className={currentCategoryId === category.id ? 'font-bold' : ''}>{category.title}</span>
              </Link>
            );
          })
        }
      </div>
    </>
  );
}