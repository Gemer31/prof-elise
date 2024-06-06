import { ICategory, IConfig, IPaginateProps, IProduct, IProductSerialized, ISearchParams } from '@/app/models';
import { Catalog } from '@/components/view/Catalog';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { ProductsList } from '@/components/view/ProductsList';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  where
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData, getFirebaseSearchFilter } from '@/utils/firebase.util';
import { redirect } from 'next/navigation';
import chunk from 'lodash.chunk';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';
import { ORDER_BY_FIELDS } from '@/app/constants';
import { FilterBar } from '@/components/view/FilterBar';
import { getPaginateUrl } from '@/utils/router.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { getProductsSerialized } from '@/utils/serialize.util';
import { getPagesCount, getPaginateProps } from '@/utils/paginate.util';

export interface ICategoriesOrProductsProps {
  searchParams: ISearchParams;
}

export default async function SearchPage(
  {searchParams}: ICategoriesOrProductsProps
) {
  const [
    settingsDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const paginateProps: IPaginateProps = getPaginateProps(searchParams);
  const productsFilters: (QueryConstraint | QueryCompositeFilterConstraint)[] = [
    getFirebaseSearchFilter(paginateProps.searchValue)
  ];
  const orderByField: string = ORDER_BY_FIELDS.get(paginateProps.orderByParams.key);

  if (orderByField) {
    productsFilters.push(orderBy(orderByField, paginateProps.orderByParams.value));
  }
  if (paginateProps.minPrice) {
    productsFilters.push(where('price', '>=', paginateProps.minPrice));
  }
  if (paginateProps.maxPrice) {
    productsFilters.push(where('price', '<=', paginateProps.maxPrice));
  }

  const productsQuerySnapshot = await getDocs(query(
    collection(db, FirestoreCollections.PRODUCTS),
    // @ts-ignore
    ...productsFilters
  ));

  paginateProps.pagesCount = getPagesCount(productsQuerySnapshot.docs.length, searchParams.pageLimit);
  if (paginateProps.pagesCount !== 0 && searchParams.page > paginateProps.pagesCount) {
    redirect(getPaginateUrl({
      baseRedirectUrl: RouterPath.SEARCH,
      page: 1,
      pageLimit: searchParams.pageLimit,
      searchValue: searchParams.q
    }));
  }

  const productsChunks = chunk(productsQuerySnapshot.docs, searchParams.pageLimit);
  const products: IProductSerialized[] = getProductsSerialized(docsToData<IProduct>(productsChunks[searchParams.page - 1]));

  paginateProps.baseRedirectUrl = RouterPath.SEARCH;

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].searchResults}]}/>
      <div
        className="text-2xl self-start py-2">{TRANSLATES[LOCALE].searchResultsByRequest}: &quot;{searchParams.q}&quot;</div>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <article className="w-full md:w-4/12 mr-4">
          <div className="sticky top-20">
            <Catalog pageLimit={searchParams.pageLimit} categories={Object.values(categories)}/>
            <FilterBar config={config} paginateProps={paginateProps}/>
          </div>
        </article>
        <ProductsList
          paginateProps={paginateProps}
          data={products}
          config={config}
        />
      </div>
    </ContentContainer>
    <ViewedRecently/>
  </>;
}

