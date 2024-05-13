'use client';

import { useEffect, useState } from 'react';
import { listAll, ref, StorageReference } from '@firebase/storage';
import { ButtonType, EditGroup, FirestoreCollections, RouterPath } from '@/app/enums';
import { auth, db, storage } from '@/app/lib/firebase-config';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Loader } from '@/components/Loader';
import { Button } from '@/components/Button';
import { GeneralEditorForm } from '@/components/data-editors/GeneralEditorForm';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { CategoryEditorForm } from '@/components/data-editors/CategoryEditorForm';
import { ProductEditorForm } from '@/components/data-editors/ProductEditorForm';
import { ImagesEditorForm } from '@/components/data-editors/ImagesEditorForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from '@firebase/firestore';
import { docsToData } from '@/utils/firebase.util';

export function AdminEditor() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isAuth, setIsAuth] = useState(false);
  const [images, setImages] = useState<StorageReference[]>();
  const [config, setConfig] = useState<IConfig>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<EditGroup | string>(EditGroup.GENERAL);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(true);
    loadData().then(() => setIsDataLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      user
        ? setIsAuth(true)
        : router.push(RouterPath.HOME);
    }
  }, [loading]);

  const loadData = async () => {
    const [
      images,
      settingsQuerySnapshot,
      categoriesQuerySnapshot,
      productsQuerySnapshot,
    ] = await Promise.all([
      listAll(ref(storage)),
      getDocs(collection(db, FirestoreCollections.SETTINGS)),
      getDocs(collection(db, FirestoreCollections.CATEGORIES)),
      getDocs(collection(db, FirestoreCollections.PRODUCTS)),
    ]);

    setImages(images.items);
    setConfig(settingsQuerySnapshot.docs[0].data() as IConfig);
    setCategories(docsToData<ICategory>(categoriesQuerySnapshot.docs));
    setProducts(docsToData<IProduct>(productsQuerySnapshot.docs));
  };

  return (
    <main className="w-full">
      <ContentContainer styleClass="flex flex-col items-center">
        <h1 className="text-2xl ">{TRANSLATES[LOCALE].editor}</h1>
        {isDataLoading || !isAuth
          ? <div className="w-full flex justify-center mt-4 overflow-hidden"><Loader className="min-h-[250px] border-pink-500"/></div>
          : <>
            <div className="w-full mt-2 mb-4 flex gap-x-3">
              {
                Object.values(EditGroup).map((v) => {
                  return <Button
                    key={v}
                    styleClass={`w-full text-amber-50 px-4 py-2 ${selectedGroup === v ? 'underline' : ''}`}
                    type={ButtonType.BUTTON}
                    callback={() => setSelectedGroup(v)}
                  >{TRANSLATES[LOCALE][v]}</Button>;
                })
              }
            </div>
            <div className="w-full">
              {
                selectedGroup === EditGroup.GENERAL
                  ? <GeneralEditorForm config={config} refreshCallback={loadData}/>
                  : <></>
              }
              {
                selectedGroup === EditGroup.CATEGORIES
                  ? <CategoryEditorForm images={images} categories={categories} refreshCallback={loadData}/>
                  : <></>
              }
              {
                selectedGroup === EditGroup.PRODUCTS
                  ? <ProductEditorForm categories={categories} products={products} images={images} refreshCallback={loadData}/>
                  : <></>
              }
              {
                selectedGroup === EditGroup.IMAGES
                  ? <ImagesEditorForm images={images} refreshCallback={loadData}/>
                  : <></>
              }
            </div>
          </>
        }
      </ContentContainer>
    </main>
  );
}