'use client';

import { ButtonType, EditGroup, FirebaseCollections } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { GeneralEditorForm, IFirebaseGeneralEditorInfo } from '@/components/GeneralEditorForm';
import { CategoryEditorForm } from '@/components/CategoryEditorForm';
import { ProductEditorForm } from '@/components/ProductEditorForm';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { Loader } from '@/components/loader/loader';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { getDocData } from '@/utils/firebase-collections.util';

export default function EditorPage() {
  const groupButtonClass = convertToClass([
    'w-full',
    'text-amber-50',
    'px-4',
    'py-2'
  ]);

  const [value, loading, error] = useCollection(
    collection(db, FIREBASE_DATABASE_NAME),
    {
      snapshotListenOptions: {includeMetadataChanges: true}
    }
  );
  const [selectedGroup, setSelectedGroup] = useState(EditGroup.GENERAL);

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
          </div>
          <div className="w-full">
            {
              selectedGroup === EditGroup.GENERAL
                ? <GeneralEditorForm firebaseData={getDocData<IFirebaseGeneralEditorInfo>(value?.docs, FirebaseCollections.CONFIG)}/>
                : selectedGroup === EditGroup.CATEGORY
                  ? <CategoryEditorForm/>
                  : <ProductEditorForm/>
            }
          </div>
        </>
      }
    </main>
  );
}