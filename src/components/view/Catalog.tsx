'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ICategory } from '@/app/models';
import { PageLimits, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Loader } from '@/components/ui/Loader';

interface ICategoriesProps {
  pageLimit?: number;
  categories: ICategory[];
  currentCategoryId?: string;
}

export function Catalog({
  categories,
  currentCategoryId,
  pageLimit,
}: ICategoriesProps) {
  const [catalogIdIsLoading, setCatalogIdIsLoading] = useState('');

  return (
    <>
      <aside className="fixed md:hidden aside-catalog-wrapper">
        <input className="aside-catalog-checkbox" type="checkbox" />
        <div className="aside-catalog-button">
          <Image
            width={30}
            height={30}
            src="/icons/categories.svg"
            alt="Catalog list"
          />
        </div>
        <div className="aside-catalog">
          <h2 className="text-center text-2xl font-bold text-amber-50 mt-4">
            {TRANSLATES[LOCALE].catalog}
          </h2>
          <div className="h-[90vh] flex flex-col justify-center text-lg">
            {categories.map((category: ICategory) => (
              <Link
                className={`flex items-center py-2 text-amber-50 hover:text-pink-200 ${currentCategoryId === category.id ? 'underline' : ''}`}
                key={category.id}
                href={`${RouterPath.CATEGORIES}/${category.id}?page=1&pageLimit=${pageLimit || PageLimits.SIX}`}
              >
                <Image
                  className="mr-4 p-1 bg-amber-50 rounded-full"
                  width={25}
                  height={25}
                  src={category.imageUrl}
                  alt={category.title}
                />
                <span
                  className={
                    currentCategoryId === category.id ? 'font-bold' : ''
                  }
                >
                  {category.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
      <section className="hidden md:block rounded-md border-2 bg-pink-300">
        {categories.map((category) => (
          <Link
            className={
              'flex items-center relative w-full categories-item duration-500 transition-colors hover:bg-pink-100 px-4 py-3 ' +
              (currentCategoryId === category.id ? 'pointer-events-none' : '')
            }
            key={category.id}
            href={`${RouterPath.CATEGORIES}/${category.id}?page=1&pageLimit=${pageLimit || PageLimits.SIX}`}
            onClick={() => setCatalogIdIsLoading(category.id)}
          >
            <div className="flex items-center">
              <Image
                className="mr-4 p-1 bg-amber-50 rounded-full"
                width={25}
                height={25}
                src={category.imageUrl}
                alt={category.title}
              />
              <span
                className={currentCategoryId === category.id ? 'font-bold' : ''}
              >
                {category.title}
              </span>
            </div>
            {catalogIdIsLoading === category.id ? (
              <div className="absolute left-0 top-0 bottom-0 py-2.5 w-full flex justify-center overflow-hidden bg-black-1/5">
                <Loader className="border-pink-500" />
              </div>
            ) : (
              <></>
            )}
          </Link>
        ))}
      </section>
    </>
  );
}
