'use client';

import { ICategory } from '@/app/models';
import { useState } from 'react';
import { CategoryCard } from '@/components/CategoryCard';

export interface ICategoriesListProps {
  data: ICategory[];
}

export function CategoriesList({data}: ICategoriesListProps) {
  const [redirectIdInProgress, setRedirectIdInProgress] = useState('');

  return data.map((category) => (
    <CategoryCard
      key={category.id}
      data={category}
      isLoading={redirectIdInProgress === category.id}
      onClick={() => setRedirectIdInProgress(category.id)}
    />));
}