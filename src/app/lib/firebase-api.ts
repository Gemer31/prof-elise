import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import {
  convertCategoriesDataToModelArray,
  convertConfigDataToModel,
  convertProductsDataToModelArray,
  getDocData
} from '@/utils/firebase.util';
import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';

export async function getFirestoreData(): Promise<{
  config: IConfig;
  categories: ICategory[];
  products: IProduct[];
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
    products: convertProductsDataToModelArray(getDocData<IFirestoreFields>(
      firestoreData?.docs,
      FirebaseCollections.PRODUCTS
    )) || [],
  };
}