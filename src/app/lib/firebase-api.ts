import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { convertCategoriesDataToModelArray, convertConfigDataToModel, getDocData } from '@/utils/firebase.util';
import { ICart, ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';

export interface ICart2 {
  cart: ICart;
  favourites: Record<string, IProduct>;
}
export async function getFirestoreData(): Promise<{
  config: IConfig;
  categories: ICategory[];
}> {
  const firestoreData = await getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME)));
  return {
    config: convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
      firestoreData.docs,
      FirebaseCollections.CONFIG
    )),
    categories: convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
      firestoreData?.docs,
      FirebaseCollections.CATEGORIES
    )) || [],
  };
}

export async function getConfig(): Promise<IConfig> {
  const config = await getDoc(doc(db, 'app', FirebaseCollections.CONFIG));
  return config.data() as IConfig;
}

export async function getProductsV2(): Promise<Record<string, IProduct>> {
  const productsV2Pr = await getDoc(doc(db, 'app', FirebaseCollections.PRODUCTS_V2));
  return productsV2Pr.data() as Record<string, IProduct>;
}