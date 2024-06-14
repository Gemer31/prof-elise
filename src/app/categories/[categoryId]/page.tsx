import {
  ICategory,
  IConfig,
  IPaginateProps,
  IProduct,
  IProductSerialized,
  ISearchParams,
} from '@/app/models';
import { Catalog } from '@/components/view/Catalog';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { ProductsList } from '@/components/view/ProductsList';
import {
  FirestoreCollections,
  FirestoreDocuments,
  RouterPath,
} from '@/app/enums';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  where,
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { notFound, redirect } from 'next/navigation';
import chunk from 'lodash.chunk';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';
import { ORDER_BY_FIELDS } from '@/app/constants';
import { FilterBar } from '@/components/view/FilterBar';
import { getPagesCount, getPaginateProps } from '@/utils/paginate.util';
import { getPaginateUrl } from '@/utils/router.util';
import { SerializationUtil } from '@/utils/serialization.util';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export interface ICategoriesOrProductsProps {
  params: { categoryId: string };
  searchParams: ISearchParams;
}

export default async function CategoriesOrProductsPage({
  params: { categoryId },
  searchParams,
}: ICategoriesOrProductsProps) {
  const [settingsDocumentSnapshot, categoriesQuerySnapshot] = await Promise.all(
    [
      getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
      getDocs(collection(db, FirestoreCollections.CATEGORIES)),
    ]
  );
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(
    categoriesQuerySnapshot.docs
  );
  const currentCategory: ICategory = Object.values(categories).find(
    (item) => item.id === categoryId
  );

  !currentCategory && notFound();

  const paginateProps: IPaginateProps = getPaginateProps(searchParams);
  const productsFilters: QueryConstraint[] = [
    where(
      'categoryRef',
      '==',
      doc(db, FirestoreCollections.CATEGORIES, categoryId)
    ),
  ];

  const orderByField: string = ORDER_BY_FIELDS.get(
    paginateProps.orderByParams.key
  );
  if (orderByField) {
    productsFilters.push(
      orderBy(orderByField, paginateProps.orderByParams.value)
    );
  }
  if (paginateProps?.minPrice) {
    productsFilters.push(where('price', '>=', paginateProps.minPrice));
  }
  if (paginateProps?.maxPrice) {
    productsFilters.push(where('price', '<=', paginateProps.maxPrice));
  }

  const productsQuerySnapshot = await getDocs(
    query(collection(db, FirestoreCollections.PRODUCTS), ...productsFilters)
  );

  paginateProps.pagesCount = getPagesCount(
    productsQuerySnapshot.docs.length,
    paginateProps.pageLimit
  );

  if (paginateProps.page > paginateProps.pagesCount) {
    redirect(
      `${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${paginateProps.pageLimit}`
    );
  }

  const productsChunks = chunk(
    productsQuerySnapshot.docs,
    paginateProps.pageLimit
  );
  const products: IProductSerialized[] =
    SerializationUtil.getSerializedProducts(
      docsToData<IProduct>(productsChunks[paginateProps.page - 1])
    );
  paginateProps.baseRedirectUrl = RouterPath.CATEGORIES + '/' + categoryId;

  return (
    <>
      <SubHeader config={config} />
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <Breadcrumbs
          links={[
            {
              title: String(currentCategory?.title),
              href: getPaginateUrl(paginateProps),
            },
          ]}
        />
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
          <article className="w-full md:w-4/12 mr-4">
            <div className="sticky top-20">
              <Catalog
                pageLimit={paginateProps.pageLimit}
                categories={Object.values(categories)}
                currentCategoryId={categoryId}
              />
              <FilterBar config={config} paginateProps={paginateProps} />
            </div>
          </article>
          <ProductsList
            data={products}
            config={config}
            paginateProps={paginateProps}
          />
        </div>
      </ContentContainer>
      <ViewedRecently />
    </>
  );
}
