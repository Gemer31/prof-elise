import { collection, getDocs, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';
import { IProduct, IViewedRecently } from '@/app/models';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { IClient } from '@/store/dataSlice';

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