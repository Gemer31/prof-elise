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
import { TextEditor } from '@/components/data-editors/TextEditor';

const validationSchema = yup.object().shape({
  title: yup.string().required('fieldRequired'),
  price: yup.string()
    .matches(/^\d*(\.\d{2})?$/, 'invalidPrice')
    .required('fieldRequired'),
  description: yup.string().required('fieldRequired'),
  categoryId: yup.string().required('fieldRequired'),
  images: yup.array().required('fieldRequired')
});

export interface ProductEditorFormProps {
  categories: ICategory[];
  products: IProduct[];
  images?: StorageReference[];
  refreshCallback?: () => void;
}

export function ProductEditorForm({
                                    categories,
                                    products,
                                    images,
                                    refreshCallback
                                  }: ProductEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [selectedImages, setSelectedImages] = useState<StorageReference[]>();
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
    price: string,
    description: string,
    categoryId: string,
    images: StorageReference[]
  }) => {
    setIsLoading(true);
    let data: WithFieldValue<DocumentData> = {};

    const imageUrls: string[] = formData.images.map((img) => (getStorageImageSrc(img)));

    if (selectedProduct) {
      products.forEach((product: IProduct) => {
        if (product.id === selectedProduct.id) {
          data[product.id] = {
            ...selectedProduct,
            title: formData.title,
            price: formData.price,
            description: formData.description,
            categoryId: formData.categoryId,
            imageUrls: imageUrls
          };
        } else {
          data[product.id] = product;
        }
      });
    } else {
      products.forEach((product: IProduct) => {
        data[product.id] = product;
      });

      const id: string = uuidv4();
      data[id] = {
        id,
        title: formData.title,
        price: formData.price,
        description: formData.description,
        categoryId: formData.categoryId,
        imageUrls: imageUrls
      }
    }

    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.PRODUCTS_V2), data);
      dispatch(setNotificationMessage(
        selectedProduct
          ? TRANSLATES[LOCALE].infoUpdated
          : TRANSLATES[LOCALE].productAdded
      ));
      setSelectedImages(undefined);
      setSelectedCategory(undefined);
      reset();
      refreshCallback?.();
    } catch (e) {
      console.log('Update product error: ', e);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const deleteProduct = async (deletedProduct: IProduct) => {
    setIsLoading(true);

    let data: WithFieldValue<DocumentData> = {
      data: products.filter((product) => product.id !== deletedProduct.id)
    };

    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.PRODUCTS), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].productDeleted));
      changeProduct(undefined);
      reset();
      refreshCallback?.();
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

  const changeCategory = (newCategory: ICategory) => {
    setValue('categoryId', newCategory?.id || '');
    setSelectedCategory(newCategory);
  };

  const changeProduct = (newProduct: IProduct) => {
    if (newProduct) {
      const productCategory = categories.find((category) => category.id === newProduct.categoryId);
      const productImages: StorageReference[] = images?.filter((img) => {
        return newProduct.imageUrls?.find((productImg) => productImg.includes(img.name));
      }) || [];

      setValue('title', newProduct.title);
      setValue('price', newProduct.price);
      setValue('description', newProduct.description);
      setValue('categoryId', newProduct.categoryId);
      setValue('images', productImages);

      setDescription(newProduct.description);
      setSelectedCategory(productCategory);
      setSelectedImages(productImages);
    } else {
      setValue('title', '');
      setValue('price', '');
      setValue('description', '');
      setValue('categoryId', '');
      setValue('images', []);

      setDescription('');
      setSelectedCategory(undefined);
      setSelectedImages(undefined);
    }
    setSelectedProduct(newProduct);
  };

  const descriptionChange = (newValue: string) => {
    setValue('description', newValue);
    setDescription(newValue);
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="pb-4">
        <ProductsViewer
          selectedProduct={selectedProduct}
          firestoreProducts={products}
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
        label={TRANSLATES[LOCALE].priceWithExamples}
        name="price"
        type="text"
        error={errors.price?.message}
        register={register}
      />
      <FormFieldWrapper
        label={TRANSLATES[LOCALE].description}
        required={true}
        error={errors.description?.message}
      >
        <TextEditor
          placeholder={TRANSLATES[LOCALE].enterDescription}
          value={description}
          onChange={descriptionChange}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        required={true}
        label={TRANSLATES[LOCALE].category}
        error={errors.categoryId?.message}
      >
        <CategoriesViewer
          firestoreCategories={categories}
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
          storageData={images}
          selectedImages={selectedImages}
          selectImageClick={changeImage}
        />
      </FormFieldWrapper>
      <div className="w-full mt-2">
        <Button
          styleClass="text-amber-50 w-full py-2"
          disabled={isLoading}
          loading={isLoading}
          type={ButtonType.SUBMIT}
        >{TRANSLATES[LOCALE].save}</Button>
      </div>
    </form>
  );
}