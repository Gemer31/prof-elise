import { ICategory, IFirestoreFields, Product } from '@/app/models';
import { CURRENCY, FIREBASE_DATABASE_NAME } from '@/app/constants';
import { Categories } from '@/components/categories/Categories';
import { Advantages } from '@/components/Advantages';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { db, storage } from '@/utils/firebaseModule';
import { listAll, ref } from '@firebase/storage';
import { convertCategoriesDataToModelArray, convertProductsDataToModelArray, getDocData } from '@/utils/firebase.util';
import { useAppDispatch } from '@/store/store';
import { ProductDetailsActionsBlock } from '@/components/ProductDetailsActionsBlock';

export interface ProductDetailsProps {
  params: {
    productId: string;
  }
}

export default async function ProductDetails({ params: { productId } }: ProductDetailsProps) {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, FIREBASE_DATABASE_NAME)),
    listAll(ref(storage))
  ]);
  const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.CATEGORIES,
  ));
  const product: Product | undefined = convertProductsDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.PRODUCTS,
  )).find((item) => item.id === productId);


  // todo: redirect if not found
  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12 mr-4">
          <Categories categories={categories}/>
          <Advantages/>
        </div>
        <div className="w-full">
          <div className="w-full flex">
            <div>
              <Image width={500} height={500} src={product?.imageUrls?.[0] || ''} alt={product?.title || ''}/>
            </div>
            <div className="w-full ml-4">
              <div className="mb-4 text-2xl bold text-center">{product?.title}</div>
              <div className="w-full text-2xl text-pink-500 font-bold text-center">{product?.price} {CURRENCY}</div>
              <ProductDetailsActionsBlock product={product}/>
            </div>
          </div>
          <div>{product?.description}</div>
        </div>
      </div>
    </main>
  )
}