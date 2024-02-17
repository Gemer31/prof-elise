'use client';

import { useEffect, useState } from 'react';
import { listAll, ref, StorageReference } from '@firebase/storage';
import { ButtonType, EditGroup, FirebaseCollections } from '@/app/enums';
import { storage } from '@/app/lib/firebase-config';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Loader } from '@/components/Loader';
import { Button } from '@/components/Button';
import { GeneralEditorForm } from '@/components/data-editors/GeneralEditorForm';
import { ICategory, IConfig, IProduct } from '@/app/models';
import { CategoryEditorForm } from '@/components/data-editors/CategoryEditorForm';
import { ProductEditorForm } from '@/components/data-editors/ProductEditorForm';
import { ImagesEditorForm } from '@/components/data-editors/ImagesEditorForm';
import { getFirestoreData } from '@/app/lib/firebase-api';

export function AdminEditor() {
  const [images, setImages] = useState<StorageReference[]>();
  const [config, setConfig] = useState<IConfig>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<EditGroup | string>(EditGroup.GENERAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadData().then(() => setLoading(false));
  }, []);

  const loadData = async () => {
    const [
      images,
      firebaseData,
    ] = await Promise.all([
      listAll(ref(storage)),
      getFirestoreData(),
    ]);
    setImages(images.items);
    setConfig(firebaseData.config);
    setCategories(firebaseData.categories)
    setProducts(firebaseData.products);
  };

  return (
    <main className="w-full">
      <ContentContainer styleClass="flex flex-col items-center">
        <h1 className="text-2xl ">{TRANSLATES[LOCALE].editor}</h1>
        {loading
          ? <div className="w-full flex justify-center mt-4 overflow-hidden"><Loader styleClass="min-h-[250px] border-pink-500"/></div>
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