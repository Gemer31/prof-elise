import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { FirebaseCollections } from '@/app/enums';
import { collection, getDocs } from '@firebase/firestore';
import { listAll, ref } from '@firebase/storage';
import {
  convertCategoriesDataToModelArray,
  convertConfigDataToModel,
  convertProductsDataToModelArray,
  getDocData
} from '@/utils/firebase.util';
import { ProductDetailsActionsBlock } from '@/components/ProductDetailsActionsBlock';
import { ContentContainer } from '@/components/ContentContainer';
import { db, storage } from '@/app/lib/firebase-config';
import { ImgGallery } from '@/components/ImgGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export interface ProductDetailsProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetailsPage({params: {productId}}: ProductDetailsProps) {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
    listAll(ref(storage))
  ]);
  const product: IProduct | undefined = convertProductsDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.PRODUCTS
  )).find((item) => item.id === productId);
  const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.CATEGORIES
  ));
  const productCategory = categories.find((item) => item.id === product?.categoryId);
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));

  // todo: redirect if not found
  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center">
        <Breadcrumbs category={productCategory} product={product}/>
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full md:w-4/12 mr-4">
            <Catalog currentCategoryId={product?.categoryId} categories={categories}/>
            <Advantages styleClass="hidden md:block"/>
          </div>
          <div className="w-full flex justify-between">
            <div className="w-full">
              <div className="w-full block md:flex">
                <div className="mb-4 text-2xl bold text-center md:hidden">{product?.title}</div>
                <ImgGallery imageUrls={product?.imageUrls}/>
                <div className="w-full md:ml-4 mt-4 md:mt-0">
                  <div className="mb-4 text-2xl bold text-center hidden md:block">{product?.title}</div>
                  <div
                    className="w-full text-2xl text-pink-500 font-bold text-center">{product?.price} {config.currency}</div>
                  <ProductDetailsActionsBlock product={product}/>
                </div>
              </div>
              <div className="mt-4 ql-editor no-paddings whitespace-pre-line"
                   dangerouslySetInnerHTML={{__html: product?.description || ''}}
              />
            </div>
          </div>
        </div>
      </ContentContainer>
    </main>
  );
}