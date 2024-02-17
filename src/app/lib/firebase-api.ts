import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import {
  convertCategoriesDataToModelArray,
  convertConfigDataToModel,
  convertProductsDataToModelArray,
  getDocData
} from '@/utils/firebase.util';
import { IFirestoreConfigEditorInfo, IFirestoreFields } from '@/app/models';

export async function getFirebaseData<T>(type?: FirebaseCollections): Promise<T> {
  const firestoreData = await getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME)));
  switch (type) {
    case FirebaseCollections.CONFIG: {
      return convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
        firestoreData.docs,
        FirebaseCollections.CONFIG,
      )) as T;
    }
    case FirebaseCollections.CATEGORIES: {
      return convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
        firestoreData?.docs,
        FirebaseCollections.CATEGORIES
      )) as T;
    }
    case FirebaseCollections.PRODUCTS: {
      return convertProductsDataToModelArray(getDocData<IFirestoreFields>(
        firestoreData?.docs,
        FirebaseCollections.PRODUCTS
      )) as T;
    }
    default: {
      return firestoreData as T;
    }
  }
}