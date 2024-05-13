'use client'

import { ICommonProps } from '@/app/models';
import { useState } from 'react';

export enum SortType {
  DESC = 'descent',
  ASC = 'ascent',

}
interface ISortByButtonProps extends ICommonProps {
  isActive: boolean;
  callback: (type: SortType) => void;
}

export function SortByButton({children, callback, isActive}: ISortByButtonProps) {
  const [sortType, setSortType] = useState<SortType>();

  return <button
    className={isActive ? 'text-pink-500' : 'text-gray-400'}
    onClick={() => {
      const newSortType = sortType === SortType.DESC ? SortType.ASC : SortType.DESC;
      setSortType(newSortType)
      callback(newSortType);
    }}>
    {children} {sortType === SortType.ASC ? '🡑' : '🡓'}
  </button>
}