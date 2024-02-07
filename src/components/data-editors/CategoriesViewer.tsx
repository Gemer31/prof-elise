import Image from 'next/image';
import { ICategory } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';

interface CategoriesViewerProps {
  selectedCategory?: ICategory | undefined;
  firestoreCategories: ICategory[];
  editAvailable?: boolean;
  deleteCategoryClick?: (category: ICategory) => void;
  selectCategoryClick?: (category: ICategory | undefined) => void;
}

export function CategoriesViewer({
                                   firestoreCategories,
                                   editAvailable,
                                   selectCategoryClick,
                                   deleteCategoryClick,
                                   selectedCategory
                                 }: CategoriesViewerProps) {
  const itemClass = convertToClass([
    'cursor-pointer',
    'flex',
    'justify-between',
    'items-center',
    'px-2',
    'py-1'
  ]);

  const [chosenCategory, setChosenCategory] = useState<ICategory | undefined>();

  useEffect(() => {
    setChosenCategory(selectedCategory);
  }, [selectedCategory]);

  const selectCategory = (category: ICategory | undefined) => {
    setChosenCategory(category);
    selectCategoryClick?.(category);
  };

  return (
    <>
    {
      !firestoreCategories?.length && !editAvailable
        ? <div
          className="w-full text-center rounded-md border-pink-500 border-2 px-2 py-1">{TRANSLATES[LOCALE].noCategories}</div>
        : (
          <div className="overflow-auto max-h-72 w-full rounded-md border-pink-500 border-2 px-2 py-1">
            {
              editAvailable
                ? <div
                  onClick={() => selectCategory(undefined)}
                  key="new"
                  className={`cursor-pointer flex justify-between items-center px-2 py-1 ${!chosenCategory ? 'rounded-md bg-pink-300' : ''}`}
                >
                  <span>{TRANSLATES[LOCALE].newCategory}</span>
                </div>
                : <></>
            }
            {
              firestoreCategories?.map((item) => (
                <div
                  onClick={() => selectCategory(item)}
                  key={item.id}
                  className={`${itemClass} ${chosenCategory?.id === item.id ? 'rounded-md bg-pink-300' : ''}`}
                >
                  <span>{item.title}</span>
                  {
                    editAvailable
                      ?
                      <Image onClick={() => deleteCategoryClick?.(item)} width={30} height={30} src="/icons/cross.svg"
                             alt="Close"/>
                      : <></>
                  }
                </div>
              ))
            }
          </div>)
    }
    </>
  );
}