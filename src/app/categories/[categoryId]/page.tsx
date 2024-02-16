import { ICategory, IConfig, IFirestoreConfigEditorInfo, IFirestoreFields, IProduct } from '@/app/models';
import { EntityCard } from '@/components/EntityCard';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { collection, getDocs } from '@firebase/firestore';
import { listAll, ref } from '@firebase/storage';
import {
  convertCategoriesDataToModelArray,
  convertConfigDataToModel,
  convertProductsDataToModelArray,
  getDocData
} from '@/utils/firebase.util';
import { FirebaseCollections } from '@/app/enums';
import { db, storage } from '@/app/lib/firebase-config';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export interface CategoriesOrProductsProps {
  params: {
    categoryId: string;
  };
}

export default async function CategoriesOrProductsPage({params: {categoryId}}: CategoriesOrProductsProps) {
  const [firestoreData, storageData] = await Promise.all([
    getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
    listAll(ref(storage))
  ]);
  const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
    firestoreData.docs,
    FirebaseCollections.CONFIG
  ));
  const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.CATEGORIES
  ));
  const currentCategory: ICategory | undefined = categories.find((item) => item.id === categoryId);
  const relatedCategories: ICategory[] = categories.filter((item) => currentCategory?.relatedCategories?.includes(item.id));
  const products: IProduct[] | undefined = convertProductsDataToModelArray(getDocData<IFirestoreFields>(
    firestoreData?.docs,
    FirebaseCollections.PRODUCTS
  )).filter((item) => item.categoryId === categoryId);


  return (
    <div className="">
      <Breadcrumbs category={currentCategory}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog categories={categories} currentCategoryId={categoryId}/>
          <Advantages styleClass="hidden md:block"/>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {
            relatedCategories?.length
              ? relatedCategories.map((category) => (
                <EntityCard key={category.id} category={category} config={config}/>))
              : products?.map((product) => (<EntityCard key={product.id} product={product} config={config}/>))
          }
        </div>
      </div>
    </div>
  );
}

