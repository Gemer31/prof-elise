import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { ICategory, IConfig, IProduct, IProductSerialized } from '@/app/models';
import { docsToData, getFavourites } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { FavouritesList } from '@/components/view/favourites-list/FavouritesList';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { Catalog } from '@/components/view/Catalog';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';
import { SerializationUtil } from '@/utils/serialization.util';
import { CLIENT_ID } from '@/app/constants';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export interface IFavouritesPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    pageLimit: number;
    page: number;
  };
}

export default async function FavouritesPage({
  searchParams: { pageLimit },
}: IFavouritesPageProps) {
  let clientId: string = cookies().get(CLIENT_ID)?.value;

  const [favourites, settingsDocumentSnapshot, categoriesQuerySnapshot] =
    await Promise.all([
      getFavourites(clientId),
      getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
      getDocs(collection(db, FirestoreCollections.CATEGORIES)),
    ]);
  const config = settingsDocumentSnapshot.data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(
    categoriesQuerySnapshot.docs
  );

  let data: IProductSerialized[] = [];
  const productsIds: string[] = Object.keys(favourites);
  if (productsIds.length) {
    const products = await getDocs(
      query(
        collection(db, FirestoreCollections.PRODUCTS),
        where('id', 'in', productsIds)
      )
    );
    data = SerializationUtil.getSerializedProducts(
      docsToData<IProduct>(products.docs)
    );
  }

  return (
    <>
      <SubHeader config={config} />
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <Breadcrumbs links={[{ title: TRANSLATES[LOCALE].favourites }]} />
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <section className="w-full gap-x-3 md:w-4/12 mr-4">
            <div className="sticky top-20">
              <Catalog
                pageLimit={pageLimit}
                categories={Object.values(categories)}
              />
            </div>
          </section>
          <section className="w-full">
            <FavouritesList serverProducts={data} config={config} />
          </section>
        </div>
      </ContentContainer>
      <ViewedRecently />
    </>
  );
}
