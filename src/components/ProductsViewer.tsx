import Image from 'next/image';
import { Category, Product } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';

interface CategoriesViewerProps {
  selectedProduct?: Product | undefined;
  firestoreProducts: Product[];
  editAvailable?: boolean;
  deleteProductClick?: (product: Product) => void;
  selectProductClick?: (product: Product | undefined) => void;
}

export function ProductsViewer({
                                 firestoreProducts,
                                   editAvailable,
                                   selectProductClick,
                                   deleteProductClick,
                                 selectedProduct
                                 }: CategoriesViewerProps) {
  const itemClass = convertToClass([
    'cursor-pointer',
    'flex',
    'justify-between',
    'items-center',
    'px-2',
    'py-1'
  ]);

  const [chosenCategory, setChosenCategory] = useState<Product | undefined>();

  useEffect(() => {
    setChosenCategory(selectedProduct);
  }, [selectedProduct]);

  const selectCategory = (product: Product | undefined) => {
    setChosenCategory(product);
    selectProductClick?.(product);
  };

  return (
    <div className="overflow-y-hidden max-h-52 w-full rounded-md border-pink-500 border-2 px-2 py-1">
      <div
        onClick={() => selectCategory(undefined)}
        key="new"
        className={`cursor-pointer flex justify-between items-center px-2 py-1 ${!chosenCategory ? 'rounded-md bg-pink-300' : ''}`}
      >
        <span>{TRANSLATES[LOCALE].newProduct}</span>
      </div>
      {
        firestoreProducts?.map((item) => (
          <div
            onClick={() => selectCategory(item)}
            key={item.id}
            className={`${itemClass} ${chosenCategory?.id === item.id ? 'rounded-md bg-pink-300' : ''}`}
          >
            <span>{item.title}</span>
            {
              editAvailable
                ?
                <Image onClick={() => deleteProductClick?.(item)} width={30} height={30} src="/icons/cross.svg"
                       alt="Close"/>
                : <></>
            }
          </div>
        ))
      }
    </div>
  );
}