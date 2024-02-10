import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useState } from 'react';
import { ImagesViewer } from '@/components/data-editors/ImagesViewer';
import { StorageReference } from '@firebase/storage';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { setNotificationMessage } from '@/store/dataSlice';
import { uuidv4 } from '@firebase/util';
import { useAppDispatch } from '@/store/store';
import { ICategory } from '@/app/models';
import { CategoriesViewer } from '@/components/data-editors/CategoriesViewer';
import { InputFormField } from '@/components/form-fields/InputFormField';
import { db } from '@/app/lib/firebase-config';

const validationSchema = yup.object().shape({
  imageUrl: yup.string().required('fieldRequired'),
  title: yup.string().required('fieldRequired'),
  subcategories: yup.array()
});

interface CategoryEditorFormProps {
  firestoreCategories: ICategory[];
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function CategoryEditorForm({firestoreCategories, storageData, refreshData}: CategoryEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
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
    setIsLoading(true);

    let data: WithFieldValue<DocumentData>;

    if (selectedCategory) {
      data = {
        data: firestoreCategories.map((category) => {
          return category.id === selectedCategory.id ? {
            ...selectedCategory,
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
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.CATEGORIES), data);
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

  const deleteCategory = async (deleteCategory: ICategory) => {
    setIsLoading(true);

    let data: WithFieldValue<DocumentData> = {
      data: firestoreCategories.filter((category) => category.id !== deleteCategory.id)
    };

    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.CATEGORIES), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].categoryDeleted));
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

  const changeCategory = (newCategory: ICategory | undefined) => {
    if (newCategory) {
      const existingImage: StorageReference | undefined = storageData?.find((img) => newCategory?.imageUrl?.includes(img.fullPath));
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
        editAvailable={true}
        selectedCategory={selectedCategory}
        firestoreCategories={firestoreCategories}
        deleteCategoryClick={deleteCategory}
        selectCategoryClick={changeCategory}
      />
      <div className="mt-2">
        <ImagesViewer
          storageData={storageData}
          selectImageClick={changeImage}
          selectedImages={selectedImage ? [selectedImage] : []}
        />
      </div>
      <InputFormField
        required={true}
        placeholder={TRANSLATES[LOCALE].enterTitle}
        label={TRANSLATES[LOCALE].title}
        name="title"
        type="text"
        error={errors.title?.message}
        register={register as unknown}
      />
      {
        firestoreCategories?.length
          ? <>
            <span className="my-2">{TRANSLATES[LOCALE].subcategories}</span>
            {
              firestoreCategories?.map((category, index) => {
                return category.id !== selectedCategory?.id
                  ? <label className="flex items-center" key={category.id}>
                    <input
                      type="checkbox"
                      onChange={() => setValue(`subcategories.${index}`, category.id)}
                    />
                    <span>{category.title}</span>
                  </label>
                  : <></>;
              })
            }
          </>
          : <></>
      }
      <Button
        styleClass="text-amber-50 w-full py-2 mt-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{selectedCategory ? TRANSLATES[LOCALE].update : TRANSLATES[LOCALE].add}</Button>
    </form>
  );
}