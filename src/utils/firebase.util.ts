import { collection, doc, getDoc, getDocs, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { IClient, IClientEnriched, IProduct, IViewedRecently } from '@/app/models';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';

export function docsToData<T>(docs: Array<QueryDocumentSnapshot>): T[] {
  return docs.map(item => item.data()) as T[];
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
      const serializedProduct = {...product};
      serializedProduct.categoryId = product.categoryRef.id;
      delete serializedProduct['categoryRef'];
      return {
        time: client.viewedRecently[product.id].time,
        product: serializedProduct
      };
    });
  }
  return viewedRecently;
}

export async function getClientEnriched(client: IClient): Promise<IClientEnriched> {
  const clientEnriched: IClientEnriched = {
    cart: {},
    favourites: {},
    viewedRecently: {},
  };

  const cartProductsIds: string[] = Object.keys(client.cart);
  if (cartProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartProductsIds)
    ));
    products.forEach(item => {
      const data: IProduct = item.data() as IProduct;
      data.categoryId = data.categoryRef.id;
      delete data.categoryRef;
      clientEnriched.cart[data.id] = {
        ...client.cart[data.id],
        productRef: data,
      }
    })
  }
  const cartFavouritesProductsIds: string[] = Object.keys(client);
  if (cartFavouritesProductsIds?.length) {
    const products = await getDocs(query(
      collection(db, FirestoreCollections.PRODUCTS),
      where('id', 'in', cartFavouritesProductsIds)
    ));
    products.forEach(item => {
      const data = item.data() as IProduct;
      clientEnriched.favourites[data.id] = data;
    })
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
        productRef: data,
      };
    })
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
      productRef: doc(db, FirestoreCollections.PRODUCTS, item.productRef.id),
    };
  });
  Object.values(enrichedClient.favourites).forEach(item => {
    client.favourites[item.id] = doc(db, FirestoreCollections.PRODUCTS, item.id);
  });
  Object.values(enrichedClient.viewedRecently).forEach(item => {
    client.viewedRecently[item.productRef.id] = {
      time: client.viewedRecently[item.productRef.id].time,
      productRef: doc(db, FirestoreCollections.PRODUCTS, item.productRef.id),
    };
  });

  return client;
}