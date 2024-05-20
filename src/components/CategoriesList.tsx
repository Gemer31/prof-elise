'use client';

import { ICategory } from '@/app/models';
import { useState } from 'react';
import { CategoryCard } from '@/components/CategoryCard';

export interface ICategoriesListProps {
  data: ICategory[];
  pageLimit: number;
  itemsLimit?: number;
}

export function CategoriesList({data, pageLimit, itemsLimit}: ICategoriesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.map((category, index) => (
      itemsLimit > index - 1
        ? <></>
        : <CategoryCard
          key={category.id}
          pageLimit={pageLimit}
          data={category}
          isLoading={redirectIdInProgress === category.id}
          onClick={() => setRedirectIdInProgress(category.id)}
        />))}
  </div>;
}