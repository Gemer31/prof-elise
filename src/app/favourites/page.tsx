import { collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { docsToData } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { redirect } from 'next/navigation';
import { IClient } from '@/store/dataSlice';
import { BasePage } from '@/components/BasePage';
import { FavouritesList } from '@/components/favourites-list/FavouritesList';
import { ContentContainer } from '@/components/ContentContainer';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { LOCALE, TRANSLATES } from '@/app/translates';

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
    settingsDocumentSnapshot,
    clientDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config = settingsDocumentSnapshot.data() as IConfig;
  let data: IProduct[] = [];
  const client: IClient = clientDocumentSnapshot.data() as IClient;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);

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

  return <BasePage config={config}>
    <main>
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full gap-x-3 md:w-4/12 mr-4">
            <Catalog pageLimit={pageLimit} categories={Object.values(categories)}/>
            <Advantages/>
          </div>
          <div className="w-full">
            <h2 className="text-center text-xl uppercase mb-4">{TRANSLATES[LOCALE].favouriteProducts}</h2>
            <FavouritesList serverProducts={data} config={config}/>
          </div>
        </div>
      </ContentContainer>
    </main>
  </BasePage>;
}