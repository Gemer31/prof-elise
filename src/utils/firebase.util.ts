import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  where
} from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { ICartProductModel, IProduct, IProductSerialized, IViewedRecently, IViewedRecentlyModel } from '@/app/models';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { CLIENT_ID } from '@/app/constants';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { SerializationUtil } from '@/utils/serialization.util';

export function docsToData<T>(docs: Array<QueryDocumentSnapshot>): T[] {
  return docs?.map(item => item.data()) as T[] || [];
}

export function getStorageImageSrc(image: StorageReference): string {
  return image ? `https://firebasestorage.googleapis.com/v0/b/${image.bucket}/o/${image.fullPath}?alt=media` : '';
}

export function converImageUrlsToGallery(imgs: string[]): { original: string }[] {
  return imgs.map((imgUrl) => ({
    original: imgUrl
  }));
}

export async function getEnrichedViewedRecently(viewedRecently: Record<string, IViewedRecentlyModel>): Promise<IViewedRecently[]> {
  let viewedRecentlyArr: IViewedRecently[] = [];
  const viewedRecentlyProductsIds: string[] = viewedRecently ? Object.keys(viewedRecently) : [];
  if (viewedRecentlyProductsIds.length) {
    const viewedRecentlyQuerySnapshot = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', viewedRecentlyProductsIds)
      // orderBy('time', 'desc') ??
    ));
    const viewedRecentlyProducts = docsToData<IProduct>(viewedRecentlyQuerySnapshot.docs);
    viewedRecentlyArr = viewedRecentlyProducts.map(product => {
      return {
        time: viewedRecently[product.id].time,
        product: SerializationUtil.getSerializedProduct(product)
      };
    });
  }
  return viewedRecentlyArr;
}

export async function getEnrichedCart(
  cart: Record<string, ICartProductModel<string>>
): Promise<Record<string, ICartProductModel<IProductSerialized>>> {
  const enrichedCart: Record<string, ICartProductModel<IProductSerialized>> = {};
  const cartProductsIds: string[] = cart ? Object.keys(cart) : [];

  if (cartProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartProductsIds)
    ));
    products.forEach(item => {
      const data: IProductSerialized = SerializationUtil.getSerializedProduct(item.data() as IProduct);
      enrichedCart[data.id] = {
        ...cart[data.id],
        productRef: data
      };
    });
  }

  return enrichedCart;
}

export async function getClientData<T>(
  collection: FirestoreCollections.FAVOURITES | FirestoreCollections.CART | FirestoreCollections.VIEWED_RECENTLY,
  cookies: ReadonlyRequestCookies
): Promise<T> {
  let clientId: string = cookies.get(CLIENT_ID)?.value;
  let data: T;

  if (clientId?.length) {
    const viewedRecentlyDocumentSnapshot = await getDoc(doc(db, collection, clientId));
    data = viewedRecentlyDocumentSnapshot.data() as T;
  }

  if (!data) {
    data = {} as T;
  }

  return data;
}

export function getFirebaseSearchFilter(searchValue: string, additionalFilters: QueryFieldFilterConstraint[] = []) {
  return or(
    // query as-is:
    and(
      where('title', '>=', searchValue),
      where('title', '<=', searchValue + '\uf8ff'),
      ...additionalFilters
    ),
    // capitalize first letter:
    and(
      where('title', '>=', searchValue.charAt(0).toUpperCase() + searchValue.slice(1)),
      where('title', '<=', searchValue.charAt(0).toUpperCase() + searchValue.slice(1) + '\uf8ff'),
      ...additionalFilters
    ),
    // lowercase:
    and(
      where('title', '>=', searchValue.toLowerCase()),
      where('title', '<=', searchValue.toLowerCase() + '\uf8ff'),
      ...additionalFilters
    )
  );
}