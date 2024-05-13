import { ICategory, IConfig, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProductsList } from '@/components/ProductsList';
import { FirestoreCollections, PageLimits, RouterPath } from '@/app/enums';
import { collection, doc, getDocs, limit, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { redirect } from 'next/navigation';

export interface ICategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
  };
}

export default async function CategoriesOrProductsPage(
  {params: {categoryId}, searchParams: {pageLimit, page}}: ICategoriesOrProductsProps
) {
  const [
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const currentCategory: ICategory = Object.values(categories).find((item) => item.id === categoryId);

  if (!Object.values<string>(PageLimits).includes(String(pageLimit))) {
    redirect(`${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${PageLimits.SIX}`);
  }
  const pagesCount: number = Math.ceil(currentCategory.productsTotal / pageLimit);
  if (page > pagesCount) {
    redirect(`${RouterPath.CATEGORIES}/${categoryId}?page=1&pageLimit=${pageLimit}`);
  }

  // 'orderBy'  'limitToLast' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
  const productsQuerySnapshot = await getDocs(query(
    collection(db, FirestoreCollections.PRODUCTS),
    where('categoryRef', '==', doc(db, FirestoreCollections.CATEGORIES, categoryId)),
    limit(pageLimit)
  ));
  const products = docsToData<IProduct>(productsQuerySnapshot.docs)
    .map((item) => {
      item.categoryId = item.categoryRef.path.split('/').pop();
      delete item.categoryRef;
      return item;
    });

  return <div>
    <Breadcrumbs
      links={[{title: String(currentCategory?.title), href: `${RouterPath.CATEGORIES}/${currentCategory?.id}`}]}/>
    <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
      <div className="w-full md:w-4/12 mr-4">
        <Catalog pageLimit={pageLimit} categories={Object.values(categories)} currentCategoryId={categoryId}/>
        <Advantages styleClass="hidden md:block"/>
      </div>
      <ProductsList
        pagesCount={pagesCount}
        categoryId={categoryId}
        pageLimit={pageLimit}
        page={page}
        data={products}
        config={config}
      />
    </div>
  </div>;
}

