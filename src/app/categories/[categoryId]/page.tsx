import { ICategory, IConfig, IProduct, IViewedRecently } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductsList } from '@/components/ProductsList';
import { FirestoreCollections, FirestoreDocuments, OrderByKeys, PageLimits, RouterPath } from '@/app/enums';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  QueryConstraint,
  where
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { notFound, redirect } from 'next/navigation';
import chunk from 'lodash.chunk';
import { ContentContainer } from '@/components/ContentContainer';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import { cookies } from 'next/headers';
import { SubHeader } from '@/components/SubHeader';
import { getCategoryUrl } from '@/utils/router.util';
import { ORDER_BY_FIELDS } from '@/app/constants';
import { FilterBar } from '@/components/FilterBar';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
    byPrice: OrderByDirection;
    byDate: OrderByDirection;
    byAlfabet: OrderByDirection;
    minPrice: string;
    maxPrice: string;
  };
}

export default async function CategoriesOrProductsPage(
  {params: {categoryId}, searchParams}: ICategoriesOrProductsProps
) {
  let orderByKey: OrderByKeys;
  let orderByValue: OrderByDirection;
  Object.keys(searchParams)?.every(key => {
    switch (key) {
      case OrderByKeys.BY_PRICE: {
        orderByKey = OrderByKeys.BY_PRICE;
        orderByValue = searchParams[OrderByKeys.BY_PRICE];
        break;
      }
      case OrderByKeys.BY_DATE: {
        orderByKey = OrderByKeys.BY_DATE;
        orderByValue = searchParams[OrderByKeys.BY_DATE];
        break;
      }
      case OrderByKeys.BY_ALFABET: {
        orderByKey = OrderByKeys.BY_ALFABET;
        orderByValue = searchParams[OrderByKeys.BY_ALFABET];
        break;
      }
    }
    if (orderByValue) {
      if (orderByValue !== 'desc' && orderByValue !== 'asc') {
        orderByValue = 'desc';
      }
      return false;
    }
    return true;
  });

  if (!Object.values<string>(PageLimits).includes(String(searchParams.pageLimit))) {
    redirect(getCategoryUrl({
      categoryId,
      page: 1,
      pageLimit: Number(PageLimits.SIX),
      orderBy: {
        key: orderByKey,
        value: orderByValue
      }
    }));
  }

  const [
    client,
    settingsDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getClient(cookies()),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const currentCategory: ICategory = Object.values(categories).find((item) => item.id === categoryId);

  if (!currentCategory) {
    notFound();
  }

  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  const productsFilters: QueryConstraint[] = [
    where('categoryRef', '==', doc(db, FirestoreCollections.CATEGORIES, categoryId))
    // limit(pageLimit),
  ];

  const orderByField: string = ORDER_BY_FIELDS.get(orderByKey);
  if (orderByField) {
    productsFilters.push(orderBy(orderByField, orderByValue));
  }
  if (searchParams.minPrice?.length) {
    productsFilters.push(where('price', '>=', Number(searchParams.minPrice)));
  }
  if (searchParams.maxPrice?.length) {
    productsFilters.push(where('price', '<=', Number(searchParams.maxPrice)));
  }

  const productsQuerySnapshot = await getDocs(query(
    collection(db, FirestoreCollections.PRODUCTS),
    ...productsFilters
  ));

  const pagesCount: number = productsQuerySnapshot.docs.length
    ? Math.ceil(productsQuerySnapshot.docs.length / searchParams.pageLimit)
    : 0;
  if (searchParams.page > pagesCount) {
    redirect(`${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${searchParams.pageLimit}`);
  }

  const productsChunks = chunk(productsQuerySnapshot.docs, searchParams.pageLimit);
  const products: IProduct[] = docsToData<IProduct>(productsChunks[searchParams.page - 1])
    .map((item) => {
      item.categoryId = item.categoryRef.path.split('/').pop();
      delete item.categoryRef;
      return item;
    });

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs
        links={[{title: String(currentCategory?.title), href: `${RouterPath.CATEGORIES}/${currentCategory?.id}`}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <article className="w-full md:w-4/12 mr-4">
          <div className="sticky top-20">
            <Catalog
              pageLimit={searchParams.pageLimit}
              categories={Object.values(categories)}
              currentCategoryId={categoryId}
            />
            <FilterBar
              config={config}
              categoryId={categoryId}
              pageLimit={searchParams.pageLimit}
              orderByParams={{
                key: orderByKey,
                value: orderByValue
              }}
              minPrice={searchParams.minPrice}
              maxPrice={searchParams.maxPrice}
            />
          </div>
        </article>
        <ProductsList
          orderByParams={{
            key: orderByKey,
            value: orderByValue
          }}
          minPrice={searchParams.minPrice}
          maxPrice={searchParams.maxPrice}
          pagesCount={pagesCount}
          categoryId={categoryId}
          pageLimit={searchParams.pageLimit}
          page={Number(searchParams.page)}
          data={products}
          config={config}
        />
      </div>
    </ContentContainer>
    <ViewedRecently
      viewedRecently={viewedRecently}
      config={config}
    />
  </>;
}

