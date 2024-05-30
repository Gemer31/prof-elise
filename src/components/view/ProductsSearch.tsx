'use client';

import { SearchInput } from '@/components/ui/SearchInput';
import { collection, getDocs, limit, query } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, PageLimits, RouterPath } from '@/app/enums';
import { useMemo, useState } from 'react';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { docsToData, getFirebaseSearchFilter } from '@/utils/firebase.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Loader } from '@/components/ui/Loader';
import Link from 'next/link';
import currency from 'currency.js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPaginateUrl } from '@/utils/router.util';

interface IProductsSearchProps {
  config: IConfig;
}

export function ProductsSearch({config}: IProductsSearchProps) {
  const router = useRouter();
  const [searchData, setSearchData] = useState<(ICategory | IProduct)[]>();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);
  const searchRedirectUrl = useMemo(() => getPaginateUrl({
      baseUrl: RouterPath.SEARCH,
      page: 1,
      pageLimit: Number(PageLimits.SIX),
      searchValue: searchValue
    }
  ), [searchValue]);

  const searchValueChanged = async (newSearch: string) => {
    if (newSearch?.length > 2) {
      setLoading(true);
      setResultsVisible(true);

      let newData: (ICategory | IProduct)[] = [];

      const categoriesQuerySnapshot = await getDocs(query(
        collection(db, FirestoreCollections.CATEGORIES),
        getFirebaseSearchFilter(newSearch)
      ));
      if (categoriesQuerySnapshot.docs.length) {
        newData = docsToData<ICategory>(categoriesQuerySnapshot.docs);
      }

      if (newData.length < 10) {
        const productsQuerySnapshot = await getDocs(query(
          collection(db, FirestoreCollections.PRODUCTS),
          getFirebaseSearchFilter(newSearch),
          limit(10)
        ));
        if (productsQuerySnapshot.docs.length) {
          newData = [...newData, ...docsToData<IProduct>(productsQuerySnapshot.docs)];
        }
      }

      setLoading(false);
      setSearchData(newData);
      setSearchValue(newSearch);
    } else {
      setLoading(false);
      setResultsVisible(false);
      setSearchData([]);
      setSearchValue(newSearch);
    }
  };

  const onFocus = () => {
    if (searchValue?.length > 2) {
      setLoading(false);
      setResultsVisible(true);
    }
  };

  const onBlur = () => {
    setTimeout(() => {
      setResultsVisible(false);
    }, 100);
  };

  return <section className="relative flex-grow">
    <SearchInput
      required={true}
      pattern="^(.+)$"
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmit={() => router.push(searchRedirectUrl)}
      onChange={searchValueChanged}
      searchButtonVisible={true}
    />
    {
      resultsVisible
        ?
        <div className="bg-white w-full border-2 rounded-md absolute top-[42px] shadow-md z-10">
          {
            loading
              ? <div className="flex justify-center py-2">
                <Loader className="border-pink-500 w-[30px] h-[30px]"/>
              </div>
              : searchData?.length
                ? <>
                  <div className="max-h-96 overflow-auto">
                    {
                      searchData.map((item: ICategory | IProduct) => {
                        let href: string;
                        let imageUrl: string;
                        let typeText: string;
                        let title: string;
                        let price: string;

                        // @ts-ignore
                        if (item['price']) {
                          const p = item as IProduct;
                          href = `${RouterPath.CATEGORIES}/${p?.categoryRef.id}/${RouterPath.PRODUCTS}/${p?.id}`;
                          imageUrl = p.imageUrls[0];
                          typeText = TRANSLATES[LOCALE].product;
                          title = p.title;
                          price = currency(p.price).toString();
                        } else {
                          const c: ICategory = item as ICategory;
                          href = `${RouterPath.CATEGORIES}/${c.id}?page=1&pageLimit=${PageLimits.SIX}`;
                          imageUrl = c.imageUrl;
                          typeText = TRANSLATES[LOCALE].category;
                          title = c.title;
                        }

                        return <Link
                          key={item.id}
                          href={href}
                          className="border-b-2 flex justify-between items-center p-2 hover:bg-pink-100 duration-500 transition-colors gap-x-2"
                        >
                          <Image width={50} height={50} src={imageUrl} alt={item.title}/>
                          <div className="flex-grow leading-normal">
                            <div className="text-sm text-gray-400">{typeText}</div>
                            <div className="viewed-recently__card-title">{title}</div>
                          </div>
                          <div
                            className="w-max text-pink-500 font-medium text-nowrap">{price ? price + ' ' + config.currency : ''}</div>
                        </Link>;
                      })
                    }
                  </div>
                  <Link
                    className="sticky bottom-0 bg-pink-500 text-white px-2 py-4 flex justify-center rounded-b-md"
                    href={searchRedirectUrl}
                  >
                    {TRANSLATES[LOCALE].allResults}
                    <Image
                      className="hover:scale-105 duration-200 ml-4"
                      width={25}
                      height={25}
                      src="/icons/magnifer.svg"
                      alt="Search"
                    />
                  </Link>
                </>
                : <div
                  className="w-full text-center text-lg font-medium py-2 shadow-md">{TRANSLATES[LOCALE].nothingFound}</div>
          }
        </div>
        : <></>
    }
  </section>;
}