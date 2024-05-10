import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { ICategory, IConfig, IProduct } from '@/app/models';

export async function getConfig(): Promise<IConfig> {
  const config = await getDoc(doc(
    db,
    String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME),
    FirebaseCollections.CONFIG),
  );
  return config.data() as IConfig;
}

export async function getCategories(): Promise<Record<string, ICategory>> {
  const categories = await getDoc(doc(
    db,
    String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME),
    FirebaseCollections.CATEGORIES_V2),
  );
  return categories.data() as Record<string, ICategory>;
}

export async function getProductsV2(): Promise<Record<string, IProduct>> {
  const products = await getDoc(doc(
    db,
    String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME),
    FirebaseCollections.PRODUCTS_V2),
  );
  return products.data() as Record<string, IProduct>;
}