import Image from 'next/image';
import { IProduct } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useEffect, useMemo, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { EditorsSearch } from '@/components/admin/EditorsSearch';

interface CategoriesViewerProps {
  selectedProduct?: IProduct;
  firestoreProducts: IProduct[];
  deleteProductClick?: (product: IProduct) => void;
  selectProductClick?: (product: IProduct) => void;
}

export function ProductsViewer({
  firestoreProducts,
  selectProductClick,
  deleteProductClick,
  selectedProduct,
}: CategoriesViewerProps) {
  const itemClass = useMemo(
    () =>
      convertToClass([
        'cursor-pointer',
        'flex',
        'justify-between',
        'items-center',
        'px-2',
        'py-1',
      ]),
    []
  );

  const [chosenCategory, setChosenCategory] = useState<IProduct>();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setChosenCategory(selectedProduct);
  }, [selectedProduct]);

  const selectCategory = (product: IProduct) => {
    setChosenCategory(product);
    selectProductClick?.(product);
  };

  return (
    <div className="overflow-auto max-h-48 w-full rounded-md border-pink-500 border-2">
      <EditorsSearch onChange={setSearchValue} />
      <div className="px-2 py-1">
        <div
          onClick={() => selectCategory(undefined)}
          key="new"
          className={`cursor-pointer flex justify-between items-center px-2 py-1 ${!chosenCategory ? 'rounded-md bg-pink-300' : ''}`}
        >
          <span>{TRANSLATES[LOCALE].newProduct}</span>
        </div>
        {(searchValue
          ? firestoreProducts.filter((item) =>
              item.title.toLowerCase().includes(searchValue.toLowerCase())
            )
          : firestoreProducts
        )?.map((item) => (
          <div
            onClick={() => selectCategory(item)}
            key={item.id}
            className={`${itemClass} ${chosenCategory?.id === item.id ? 'rounded-md bg-pink-300' : ''}`}
          >
            <span>{item.title}</span>
            <Image
              onClick={() => deleteProductClick?.(item)}
              width={30}
              height={30}
              src="/icons/cross.svg"
              alt="Close"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
