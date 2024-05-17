import { ICategory, IConfig, IProduct, IViewedRecently } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductsList } from '@/components/ProductsList';
import { FirestoreCollections, PageLimits, RouterPath } from '@/app/enums';
import { collection, doc, getDocs, orderBy, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { redirect } from 'next/navigation';
import chunk from 'lodash.chunk';
import { ContentContainer } from '@/components/ContentContainer';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import { cookies } from 'next/headers';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
    sortBy: string;
  };
}

export default async function CategoriesOrProductsPage(
  {params: {categoryId}, searchParams: {pageLimit, page, sortBy}}: ICategoriesOrProductsProps
) {
  if (!Object.values<string>(PageLimits).includes(String(pageLimit))) {
    redirect(`${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${PageLimits.SIX}`);
  }

  const [
    client,
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getClient(cookies()),
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const currentCategory: ICategory = Object.values(categories).find((item) => item.id === categoryId);
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  const pagesCount: number = Math.ceil(currentCategory.productsTotal / pageLimit);
  if (page > pagesCount) {
    redirect(`${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${pageLimit}`);
  }

  const productsQuerySnapshot = await getDocs(query(
    collection(db, FirestoreCollections.PRODUCTS),
    where('categoryRef', '==', doc(db, FirestoreCollections.CATEGORIES, categoryId)),
    orderBy(sortBy?.length ? sortBy : 'title')
    // limit(pageLimit),
  ));
  const productsChunks = chunk(productsQuerySnapshot.docs, pageLimit);
  const products: IProduct[] = docsToData<IProduct>(productsChunks[page - 1])
    .map((item) => {
      item.categoryId = item.categoryRef.path.split('/').pop();
      delete item.categoryRef;
      return item;
    });

  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs
        links={[{title: String(currentCategory?.title), href: `${RouterPath.CATEGORIES}/${currentCategory?.id}`}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog pageLimit={pageLimit} categories={Object.values(categories)} currentCategoryId={categoryId}/>
        </div>
        <ProductsList
          pagesCount={pagesCount}
          categoryId={categoryId}
          pageLimit={pageLimit}
          page={Number(page)}
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

