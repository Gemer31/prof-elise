import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ImagesViewer } from '@/components/ImagesViewer';
import { StorageReference } from '@firebase/storage';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';
import { uuidv4 } from '@firebase/util';
import { useAppDispatch } from '@/store/store';
import { Category } from '@/app/models';
import { CategoriesViewer } from '@/components/CategoriesViewer';

const validationSchema = yup.object().shape({
  imageUrl: yup.string().required(),
  title: yup.string().required(),
  subcategories: yup.array()
});

interface CategoryEditorFormProps {
  firestoreCategories: Category[];
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function CategoryEditorForm({firestoreCategories, storageData, refreshData}: CategoryEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedImage, setSelectedImage] = useState<StorageReference | null>();
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { title: string; imageUrl: string, subcategories?: any[] | unknown }) => {
    console.log(formData);
    setIsLoading(true);

    let data: WithFieldValue<DocumentData>;

    if (selectedCategory) {
      data = {
        data: firestoreCategories.map((category) => {
          return category.id === selectedCategory.id ? {
            id: uuidv4(),
            title: formData.title,
            imageUrl: formData.imageUrl
          } : category;
        })
      };
    } else {
      data = {
        data: [
          ...firestoreCategories,
          {
            id: uuidv4(),
            title: formData.title,
            imageUrl: formData.imageUrl
          }
        ]
      };
    }

    try {
      await setDoc(doc(db, FIREBASE_DATABASE_NAME, FirebaseCollections.CATEGORIES), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
      setSelectedImage(null);
      setSelectedCategory(undefined);
      reset();
      refreshData?.();
    } catch {
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const changeCategory = (newCategory: Category | undefined) => {
    if (newCategory) {
      const existingImage: StorageReference | undefined = storageData?.find((img) => newCategory.imageUrl.includes(img.fullPath));
      setSelectedImage(existingImage);
      setValue('title', newCategory.title);
      setValue('imageUrl', newCategory.imageUrl);
    } else {
      setValue('title', '');
      setValue('imageUrl', '');
      setSelectedImage(null);
    }
    setSelectedCategory(newCategory);
  };

  const changeImage = (newImages: StorageReference[]) => {
    const newImage = newImages[0];
    setSelectedImage(newImages[0]);
    setValue('imageUrl', newImage ? getStorageImageSrc(newImage) : '');
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <CategoriesViewer
        selectedCategory={selectedCategory}
        firestoreCategories={firestoreCategories}
        selectCategoryClick={changeCategory}
      />
      <ImagesViewer
        storageData={storageData}
        selectImageClick={changeImage}
        selectedImages={selectedImage ? [selectedImage] : []}
      />

      <label className="mb-4">
        <span className="mr-2">{TRANSLATES[LOCALE].title}</span>
        <input
          className={inputClass}
          type="text"
          {...register('title')}
        />
      </label>

      <span>{TRANSLATES[LOCALE].subcategories}</span>
      {
        firestoreCategories?.map((category, index) => {
          return <label>
            <input
              type="checkbox"
              onChange={() => setValue(`subcategories.${index}`, category.id)}
            />
            <span>{category.title}</span>
          </label>;
        })
      }

      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{selectedCategory ? TRANSLATES[LOCALE].update : TRANSLATES[LOCALE].add}</Button>
    </form>
  );
}