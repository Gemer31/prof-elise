'use client';

import { ButtonType, EditGroup, FirebaseCollections } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { GeneralEditorForm } from '@/components/data-editors/GeneralEditorForm';
import { CategoryEditorForm } from '@/components/data-editors/CategoryEditorForm';
import { ProductEditorForm } from '@/components/data-editors/ProductEditorForm';
import { collection, getDocs, QuerySnapshot } from '@firebase/firestore';
import { db, storage } from '@/utils/firebaseModule';
import { Loader } from '@/components/loader/loader';
import { convertCategoriesDataToModelArray, convertProductsDataToModelArray, getDocData } from '@/utils/firebase.util';
import { ImagesEditorForm } from '@/components/data-editors/ImagesEditorForm';
import { listAll, ref, StorageReference } from '@firebase/storage';
import { IFirestoreConfigEditorInfo, IFirestoreFields } from '@/app/models';
import { ContentContainer } from '@/components/ContentContainer';

export default function EditorPage() {
  const [storageData, setStorageData] = useState<StorageReference[]>();
  const [firestoreData, setFirestoreData] = useState<QuerySnapshot>();
  const [selectedGroup, setSelectedGroup] = useState<EditGroup | string>(EditGroup.GENERAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadData().then(() => setLoading(false));
  }, []);

  const loadData = async () => {
    const [docs, images] = await Promise.all([
        getDocs(collection(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME))),
        listAll(ref(storage)),
    ]);

    setFirestoreData(docs);
    setStorageData(images.items);
  };

  return (
    <main className="w-full">
      <ContentContainer styleClass="flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
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
                  ? <GeneralEditorForm
                    firebaseData={getDocData<IFirestoreConfigEditorInfo>(firestoreData?.docs, FirebaseCollections.CONFIG)}
                    refreshData={loadData}
                  />
                  : <></>
              }
              {
                selectedGroup === EditGroup.CATEGORIES
                  ? <CategoryEditorForm
                    storageData={storageData}
                    firestoreCategories={convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
                      firestoreData?.docs,
                      FirebaseCollections.CATEGORIES
                    ))}
                    refreshData={loadData}
                  />
                  : <></>
              }
              {
                selectedGroup === EditGroup.PRODUCTS
                  ? <ProductEditorForm
                    firestoreCategories={convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
                      firestoreData?.docs,
                      FirebaseCollections.CATEGORIES
                    ))}
                    firestoreProducts={convertProductsDataToModelArray(getDocData<IFirestoreFields>(
                      firestoreData?.docs,
                      FirebaseCollections.PRODUCTS
                    ))}
                    storageData={storageData}
                    refreshData={loadData}
                  />
                  : <></>
              }
              {
                selectedGroup === EditGroup.IMAGES
                  ? <ImagesEditorForm storageData={storageData} refreshData={loadData}/>
                  : <></>
              }
            </div>
          </>
        }
      </ContentContainer>
    </main>
  );
}