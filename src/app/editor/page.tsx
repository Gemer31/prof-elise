'use client';

import { ButtonType, EditGroup, FirebaseCollections } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { GeneralEditorForm, IFirebaseGeneralEditorInfo } from '@/components/GeneralEditorForm';
import { CategoryEditorForm } from '@/components/CategoryEditorForm';
import { ProductEditorForm } from '@/components/ProductEditorForm';
import { collection, getDocs, QuerySnapshot } from '@firebase/firestore';
import { db, storage } from '@/utils/firebaseModule';
import { Loader } from '@/components/loader/loader';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { convertCategoriesDataToModelArray, getDocData } from '@/utils/firebase.util';
import { ImagesEditorForm } from '@/components/ImagesEditorForm';
import { listAll, ref, StorageReference } from '@firebase/storage';
import { IFirestoreFields } from '@/app/models';

export default function EditorPage() {
  const groupButtonClass = convertToClass([
    'w-full',
    'text-amber-50',
    'px-4',
    'py-2'
  ]);

  const [storageData, setStorageData] = useState<StorageReference[]>();
  const [firestoreData, setFirestoreData] = useState<QuerySnapshot>();
  const [selectedGroup, setSelectedGroup] = useState(EditGroup.GENERAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadData().then(() => setLoading(false));
  }, []);

  const loadData = async () => {
    const docs = await getDocs(collection(db, FIREBASE_DATABASE_NAME));
    const images = await listAll( ref(storage));

    setFirestoreData(docs);
    setStorageData(images.items);
  }

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <h1 className="text-2xl">{TRANSLATES[LOCALE].editor}</h1>
      {loading
        ? <Loader styleClass="min-h-[30%]"/>
        : <>
          <div className="w-full m-2 flex gap-x-3">
            <Button
              styleClass={selectedGroup === EditGroup.GENERAL ? `${groupButtonClass} underline` : groupButtonClass}
              type={ButtonType.BUTTON}
              callback={() => setSelectedGroup(EditGroup.GENERAL)}
            >{TRANSLATES[LOCALE].general}</Button>
            <Button
              styleClass={selectedGroup === EditGroup.CATEGORY ? `${groupButtonClass} underline` : groupButtonClass}
              type={ButtonType.BUTTON}
              callback={() => setSelectedGroup(EditGroup.CATEGORY)}
            >{TRANSLATES[LOCALE].category}</Button>
            <Button
              styleClass={selectedGroup === EditGroup.PRODUCT ? `${groupButtonClass} underline` : groupButtonClass}
              type={ButtonType.BUTTON}
              callback={() => setSelectedGroup(EditGroup.PRODUCT)}
            >{TRANSLATES[LOCALE].product}</Button>
            <Button
              styleClass={selectedGroup === EditGroup.IMAGES ? `${groupButtonClass} underline` : groupButtonClass}
              type={ButtonType.BUTTON}
              callback={() => setSelectedGroup(EditGroup.IMAGES)}
            >{TRANSLATES[LOCALE].images}</Button>
          </div>
          <div className="w-full">
            {
              selectedGroup === EditGroup.GENERAL
                ? <GeneralEditorForm
                  firebaseData={getDocData<IFirebaseGeneralEditorInfo>(firestoreData?.docs, FirebaseCollections.CONFIG)}
                  refreshData={loadData}
                />
                : <></>
            }
            {
              selectedGroup === EditGroup.CATEGORY
                ? <CategoryEditorForm
                  storageData={storageData}
                  firestoreCategories={convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
                    firestoreData?.docs,
                    FirebaseCollections.CATEGORIES,
                  ))}
                  refreshData={loadData}
                />
                : <></>
            }
            {
              selectedGroup === EditGroup.PRODUCT
                ? <ProductEditorForm/>
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
    </main>
  );
}