import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes, FirestoreCollections } from '@/app/enums';
import { useState } from 'react';
import { ImagesViewer } from '@/components/data-editors/ImagesViewer';
import { StorageReference } from '@firebase/storage';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { deleteDoc, doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
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
  categories: ICategory[];
  images?: StorageReference[];
  refreshCallback?: () => void;
}

export function CategoryEditorForm({categories, images, refreshCallback}: CategoryEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [selectedImage, setSelectedImage] = useState<StorageReference>();
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

    let data: ICategory = {
      id: selectedCategory ? selectedCategory.id : uuidv4(),
      title: formData.title,
      imageUrl: formData.imageUrl,
      productsTotal: selectedCategory ? selectedCategory.productsTotal : 0,
    };

    try {
      await setDoc(doc(db, FirestoreCollections.CATEGORIES, data.id), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
      setSelectedImage(null);
      setSelectedCategory(undefined);
      reset();
      refreshCallback?.();
    } catch {
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const deleteCategory = async (deleteCategory: ICategory) => {
    setIsLoading(true);

    try {
      await deleteDoc(doc(db, FirestoreCollections.CATEGORIES, deleteCategory.id));
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].categoryDeleted));
      setSelectedImage(null);
      setSelectedCategory(undefined);
      reset();
      refreshCallback?.();
    } catch {
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const changeCategory = (newCategory: ICategory) => {
    if (newCategory) {
      const existingImage: StorageReference = images?.find((img) => newCategory?.imageUrl?.includes(img.fullPath));
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
        firestoreCategories={categories}
        deleteCategoryClick={deleteCategory}
        selectCategoryClick={changeCategory}
      />
      <div className="mt-2">
        <ImagesViewer
          storageData={images}
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
        categories?.length
          ? <>
            <span className="my-2">{TRANSLATES[LOCALE].subcategories}</span>
            {
              categories?.map((category, index) => {
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
      <div className="w-full mt-2">
        <Button
          styleClass="text-amber-50 w-full py-2"
          disabled={isLoading}
          loading={isLoading}
          type={ButtonTypes.SUBMIT}
        >{selectedCategory ? TRANSLATES[LOCALE].update : TRANSLATES[LOCALE].add}</Button>
      </div>
    </form>
  );
}