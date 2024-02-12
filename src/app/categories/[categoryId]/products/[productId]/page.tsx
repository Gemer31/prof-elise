import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';
import { Categories } from '@/components/Categories';
import { Advantages } from '@/components/Advantages';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { listAll, ref } from '@firebase/storage';
import {
  converImageUrlsToGallery,
  convertCategoriesDataToModelArray,
  convertConfigDataToModel,
  convertProductsDataToModelArray,
  getDocData
} from '@/utils/firebase.util';
import { ProductDetailsActionsBlock } from '@/components/ProductDetailsActionsBlock';
import { ContentContainer } from '@/components/ContentContainer';
import { db, storage } from '@/app/lib/firebase-config';
import { ImgGallery } from '@/components/ImgGallery';

export interface ProductDetailsProps {
  params: {
    productId: string;
  }
}

export default async function ProductDetailsPage({ params: { productId } }: ProductDetailsProps) {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
    listAll(ref(storage))
  ]);
  const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.CATEGORIES,
  ));
  const product: IProduct | undefined = convertProductsDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.PRODUCTS,
  )).find((item) => item.id === productId);
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));
  const galleryImages = converImageUrlsToGallery(product?.imageUrls || []);

  // todo: redirect if not found
  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
        <div className="w-full flex justify-between">
          <div className="w-4/12 mr-4">
            <Categories currentCategoryId={product?.categoryId} categories={categories}/>
            <Advantages/>
          </div>
          <div className="w-full">
            <div className="w-full flex">
              <ImgGallery imageUrls={product?.imageUrls}/>
              <div className="w-full ml-4">
                <div className="mb-4 text-2xl bold text-center">{product?.title}</div>
                <div
                  className="w-full text-2xl text-pink-500 font-bold text-center">{product?.price} {config.currency}</div>
                <ProductDetailsActionsBlock product={product}/>
              </div>
            </div>
            <div className="mt-4 ql-editor no-paddings whitespace-pre-line" dangerouslySetInnerHTML={{__html: product?.description || ''}}/>
          </div>
        </div>
      </ContentContainer>
    </main>
  )
}