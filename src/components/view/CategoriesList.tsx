'use client';

import { useState } from 'react';
import { ICategory } from '@/app/models';
import { CategoryCard } from '@/components/view/CategoryCard';

export interface ICategoriesListProps {
  data: ICategory[];
  pageLimit: number;
  itemsLimit?: number;
}

export function CategoriesList({
  data,
  pageLimit,
  itemsLimit,
}: ICategoriesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return (
    <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-2">
      {(itemsLimit ? [...data.slice(0, itemsLimit)] : data).map((category) => (
        <CategoryCard
          key={category.id}
          pageLimit={pageLimit}
          data={category}
          isLoading={redirectIdInProgress === category.id}
          onClick={() => setRedirectIdInProgress(category.id)}
        />
      ))}
    </div>
  );
}
