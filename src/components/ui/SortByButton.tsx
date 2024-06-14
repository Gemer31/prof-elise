'use client';

import { ICommonProps } from '@/app/models';
import { useEffect, useState } from 'react';
import { OrderByDirection } from '@firebase/firestore';

interface ISortByButtonProps extends ICommonProps {
  value: OrderByDirection;
  onClick: (type: OrderByDirection) => void;
}

export function SortByButton({ children, onClick, value }: ISortByButtonProps) {
  const [sortType, setSortType] = useState<OrderByDirection>();

  useEffect(() => {
    setSortType(value);
  }, [value]);

  return (
    <button
      className={value?.length ? 'text-pink-500' : 'text-gray-400'}
      onClick={() => {
        const newSortType = sortType === 'desc' ? 'asc' : 'desc';
        setSortType(newSortType);
        onClick(newSortType);
      }}
    >
      {children} {sortType === 'asc' ? '🡑' : '🡓'}
    </button>
  );
}
