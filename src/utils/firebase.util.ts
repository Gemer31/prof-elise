import {
  and,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs, or,
  query,
  QueryDocumentSnapshot, QueryFieldFilterConstraint,
  where
} from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import {
  ICartProductModel,
  IClient,
  IClientEnriched,
  IProduct,
  IProductSerialized,
  IViewedRecently
} from '@/app/models';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { CLIENT_ID } from '@/app/constants';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { getProductSerialized } from '@/utils/serialize.util';

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

export async function getViewedRecently(client: IClient): Promise<IViewedRecently[]> {
  let viewedRecently: IViewedRecently[] = [];
  const viewedRecentlyProductsIds: string[] = client?.viewedRecently
    ? Object.keys(client.viewedRecently)
    : [];
  if (viewedRecentlyProductsIds.length) {
    const viewedRecentlyQuerySnapshot = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', viewedRecentlyProductsIds)
      // orderBy('time', 'desc') ??
    ));
    const viewedRecentlyProducts = docsToData<IProduct>(viewedRecentlyQuerySnapshot.docs);
    viewedRecently = viewedRecentlyProducts.map(product => {
      return {
        time: client.viewedRecently[product.id].time,
        product: getProductSerialized(product)
      };
    });
  }
  return viewedRecently;
}

export async function getClientEnriched(client: IClient): Promise<IClientEnriched> {
  const clientEnriched: IClientEnriched = {
    cart: {},
    favourites: {},
    viewedRecently: {}
  };

  clientEnriched.cart = await getEnrichedCart(client.cart);

  const cartFavouritesProductsIds: string[] = Object.keys(client);
  if (cartFavouritesProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartFavouritesProductsIds)
    ));
    products.forEach(item => {
      const data = item.data() as IProduct;
      clientEnriched.favourites[data.id] = data;
    });
  }
  const cartViewedRecentlyProductsIds: string[] = Object.keys(client);
  if (cartViewedRecentlyProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartViewedRecentlyProductsIds)
    ));
    products.forEach(item => {
      const data = item.data() as IProduct;
      clientEnriched.viewedRecently[data.id] = {
        time: client.viewedRecently[data.id].time,
        productRef: data
      };
    });
  }

  return clientEnriched;
}

export function getNonEnrichedClient(enrichedClient: IClientEnriched): IClient {
  const client: IClient = {
    cart: {},
    favourites: {},
    viewedRecently: {}
  };

  Object.values(enrichedClient.cart).forEach(item => {
    client.cart[item.productRef.id] = {
      count: item.count,
      productRef: doc(db, FirestoreCollections.PRODUCTS, item.productRef.id)
    };
  });
  Object.values(enrichedClient.favourites).forEach(item => {
    client.favourites[item.id] = doc(db, FirestoreCollections.PRODUCTS, item.id);
  });
  Object.values(enrichedClient.viewedRecently).forEach(item => {
    client.viewedRecently[item.productRef.id] = {
      time: client.viewedRecently[item.productRef.id].time,
      productRef: doc(db, FirestoreCollections.PRODUCTS, item.productRef.id)
    };
  });

  return client;
}

export async function getEnrichedCart(
  cart: Record<string, ICartProductModel>
): Promise<Record<string, ICartProductModel<IProductSerialized>>> {
  const enrichedCart: Record<string, ICartProductModel<IProductSerialized>> = {};
  const cartProductsIds: string[] = cart ? Object.keys(cart) : [];

  if (cartProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartProductsIds)
    ));
    products.forEach(item => {
      const data: IProductSerialized = getProductSerialized(item.data() as IProduct);
      enrichedCart[data.id] = {
        ...cart[data.id],
        productRef: data
      };
    });
  }

  return enrichedCart;
}

export async function getClient(cookies: ReadonlyRequestCookies): Promise<IClient> {
  let clientId: string = cookies.get(CLIENT_ID)?.value;
  let client: IClient;

  if (clientId?.length) {
    const clientDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.CART_AND_FAVOURITES, clientId));
    client = clientDocumentSnapshot.data();
  }

  if (!client) {
    client = {
      cart: {},
      favourites: {},
      viewedRecently: {}
    };
  }

  return client;
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