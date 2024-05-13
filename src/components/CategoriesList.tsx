'use client';

import { ICategory } from '@/app/models';
import { useState } from 'react';
import { CategoryCard } from '@/components/CategoryCard';

export interface ICategoriesListProps {
  data: ICategory[];
  pageLimit: number;
}

export function CategoriesList({data, pageLimit}: ICategoriesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return <div className="w-full grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.map((category) => (
      <CategoryCard
        key={category.id}
        pageLimit={pageLimit}
        data={category}
        isLoading={redirectIdInProgress === category.id}
        onClick={() => setRedirectIdInProgress(category.id)}
      />))}
  </div>;
}