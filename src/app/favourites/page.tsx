import { collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { ICategory, IConfig, IProduct, IViewedRecently } from '@/app/models';
import { docsToData, getViewedRecently } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { redirect } from 'next/navigation';
import { IClient } from '@/store/dataSlice';
import { BasePage } from '@/components/BasePage';
import { FavouritesList } from '@/components/favourites-list/FavouritesList';
import { ContentContainer } from '@/components/ContentContainer';
import { Catalog } from '@/components/Catalog';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export interface IFavouritesPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
  };
}

export default async function FavouritesPage({searchParams: {pageLimit}}: IFavouritesPageProps) {
  const clientId: string = cookies().get(CLIENT_ID)?.value;
  if (!clientId?.length) {
    redirect(RouterPath.HOME);
  }

  const [
    clientDocumentSnapshot,
    settingsDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config = settingsDocumentSnapshot.data() as IConfig;
  let data: IProduct[] = [];
  const client: IClient = clientDocumentSnapshot.data() as IClient;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  const productsIds: string[] = Object.keys(client.favourites);
  if (productsIds.length) {
    const products = await getDocs(
      query(collection(db, FirestoreCollections.PRODUCTS), where('id', 'in', productsIds))
    );
    data = docsToData<IProduct>(products.docs)
      .map((item) => {
        item.categoryId = item.categoryRef.path.split('/').pop();
        delete item.categoryRef;
        return item;
      });
  }

  return <BasePage viewedRecently={viewedRecently} config={config}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].favourites}
      ]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full gap-x-3 md:w-4/12 mr-4">
          <Catalog pageLimit={pageLimit} categories={Object.values(categories)}/>
        </div>
        <div className="w-full">
          <h1 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].favouriteProducts}</h1>
          <FavouritesList serverProducts={data} config={config}/>
        </div>
      </div>
    </ContentContainer>
  </BasePage>;
}