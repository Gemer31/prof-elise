import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useState } from 'react';
import { CategoriesViewer } from '@/components/data-editors/CategoriesViewer';
import { ICategory, IProduct } from '@/app/models';
import { StorageReference } from '@firebase/storage';
import { ImagesViewer } from '@/components/data-editors/ImagesViewer';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { ProductsViewer } from '@/components/data-editors/ProductsViewer';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { uuidv4 } from '@firebase/util';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { InputFormField } from '@/components/form-fields/InputFormField';
import { db } from '@/app/lib/firebase-config';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';
import { TextareaFormField } from '@/components/form-fields/TextareaFormField';

const validationSchema = yup.object().shape({
  title: yup.string().required('fieldRequired'),
  price: yup.number().required('fieldRequired'),
  description: yup.string().required('fieldRequired'),
  categoryId: yup.string().required('fieldRequired'),
  images: yup.array().required('fieldRequired')
});

export interface ProductEditorFormProps {
  firestoreCategories: ICategory[];
  firestoreProducts: IProduct[];
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function ProductEditorForm({
                                    firestoreCategories,
                                    firestoreProducts,
                                    storageData,
                                    refreshData
                                  }: ProductEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [selectedImages, setSelectedImages] = useState<StorageReference[] | undefined>();
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

  const submitForm = async (formData: {
    title: string,
    price: number,
    description: string,
    categoryId: string,
    images: StorageReference[]
  }) => {
    setIsLoading(true);

    let data: WithFieldValue<DocumentData>;

    const imageUrls: string[] = formData.images.map((img) => (getStorageImageSrc(img)));

    if (selectedProduct) {
      data = {
        data: firestoreProducts.map((product: IProduct) => {
          return product.id === selectedProduct.id ? {
            ...selectedProduct,
            title: formData.title,
            price: formData.price,
            description: formData.description,
            categoryId: formData.categoryId,
            imageUrls: imageUrls
          } : product;
        })
      };
    } else {
      data = {
        data: [
          ...firestoreProducts,
          {
            id: uuidv4(),
            title: formData.title,
            price: formData.price,
            description: formData.description,
            categoryId: formData.categoryId,
            imageUrls: imageUrls
          }
        ]
      };
    }

    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.PRODUCTS), data);
      dispatch(setNotificationMessage(
        selectedProduct
          ? TRANSLATES[LOCALE].infoUpdated
          : TRANSLATES[LOCALE].productAdded
      ));
      setSelectedImages(undefined);
      setSelectedCategory(undefined);
      reset();
      refreshData?.();
    } catch {
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const deleteProduct = async (deletedProduct: IProduct) => {
    setIsLoading(true);

    let data: WithFieldValue<DocumentData> = {
      data: firestoreProducts.filter((product) => product.id !== deletedProduct.id)
    };

    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.PRODUCTS), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].productDeleted));
      changeProduct(undefined);
      reset();
      refreshData?.();
    } catch {
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const changeImage = (newImages: StorageReference[]) => {
    setSelectedImages(newImages);
    setValue(`images`, newImages);
  };

  const changeCategory = (newCategory: ICategory | undefined) => {
    setValue('categoryId', newCategory?.id || '');
    setSelectedCategory(newCategory);
  };

  const changeProduct = (newProduct: IProduct | undefined) => {
    if (newProduct) {
      const productCategory = firestoreCategories.find((category) => category.id === newProduct.categoryId);
      const productImages: StorageReference[] = storageData?.filter((img) => {
        return newProduct.imageUrls?.find((productImg) => productImg.includes(img.name));
      }) || [];

      setValue('title', newProduct.title);
      setValue('price', newProduct.price);
      setValue('description', newProduct.description);
      setValue('categoryId', newProduct.categoryId);
      setValue('images', productImages);

      setSelectedCategory(productCategory);
      setSelectedImages(productImages);
    } else {
      setValue('title', '');
      setValue('price', 0);
      setValue('description', '');
      setValue('categoryId', '');
      setValue('images', []);

      setSelectedCategory(undefined);
      setSelectedImages(undefined);
    }
    setSelectedProduct(newProduct);
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="pb-4">
        <ProductsViewer
          editAvailable={true}
          selectedProduct={selectedProduct}
          firestoreProducts={firestoreProducts}
          selectProductClick={changeProduct}
          deleteProductClick={deleteProduct}
        />
      </div>
      <InputFormField
        required={true}
        placeholder={TRANSLATES[LOCALE].enterTitle}
        label={TRANSLATES[LOCALE].title}
        name="title"
        type="text"
        error={errors.title?.message}
        register={register}
      />
      <InputFormField
        required={true}
        placeholder={TRANSLATES[LOCALE].enterPrice}
        label={TRANSLATES[LOCALE].price}
        name="price"
        type="text"
        error={errors.price?.message}
        register={register}
      />
      <TextareaFormField
        required={true}
        placeholder={TRANSLATES[LOCALE].enterDescription}
        label={TRANSLATES[LOCALE].description}
        name="description"
        type="text"
        error={errors.description?.message}
        register={register}
      />
      <FormFieldWrapper
        required={true}
        label={TRANSLATES[LOCALE].category}
        error={errors.categoryId?.message}
      >
        <CategoriesViewer
          firestoreCategories={firestoreCategories}
          selectedCategory={selectedCategory}
          selectCategoryClick={changeCategory}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        required={true}
        label={`${TRANSLATES[LOCALE].images} (${TRANSLATES[LOCALE].clickCtrlForMultipleSelect})`}
        error={errors.images?.message}
      >
        <ImagesViewer
          multiple={true}
          storageData={storageData}
          selectedImages={selectedImages}
          selectImageClick={changeImage}
        />
      </FormFieldWrapper>
      <Button
        styleClass="text-amber-50 w-full py-2 mt-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  );
}