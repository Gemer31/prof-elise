import Image from 'next/image';
import { ICategory } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useMemo, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { EditorsSearch } from '@/components/admin/EditorsSearch';

interface CategoriesViewerProps {
  selectedCategory?: ICategory;
  firestoreCategories: ICategory[];
  editAvailable?: boolean;
  deleteCategoryClick?: (category: ICategory) => void;
  selectCategoryClick?: (category: ICategory) => void;
}

export function CategoriesViewer({
                                   firestoreCategories,
                                   editAvailable,
                                   selectCategoryClick,
                                   deleteCategoryClick,
                                   selectedCategory
                                 }: CategoriesViewerProps) {
  const itemClass = useMemo(() => convertToClass([
    'cursor-pointer',
    'flex',
    'justify-between',
    'items-center',
    'px-2',
    'py-1'
  ]), []);

  const [chosenCategory, setChosenCategory] = useState<ICategory>();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setChosenCategory(selectedCategory);
  }, [selectedCategory]);

  const selectCategory = (category: ICategory) => {
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
            <div className="overflow-auto max-h-48 w-full rounded-md border-pink-500 border-2">
              <EditorsSearch onChange={setSearchValue}/>
              <div className="px-2 py-1">
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
                  (
                    searchValue
                      ? firestoreCategories.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
                      : firestoreCategories
                  )?.map((item) => (
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
              </div>
            </div>)
      }
    </>
  );
}