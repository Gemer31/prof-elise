import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, FirestoreCollections } from '@/app/enums';
import { useState } from 'react';
import { CategoriesViewer } from '@/components/admin/CategoriesViewer';
import { ICategory, ILabel, IProduct } from '@/app/models';
import { StorageReference } from '@firebase/storage';
import { ImagesViewer } from '@/components/admin/ImagesViewer';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { ProductsViewer } from '@/components/admin/ProductsViewer';
import { deleteDoc, doc, setDoc } from '@firebase/firestore';
import { uuidv4 } from '@firebase/util';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { db } from '@/app/lib/firebase-config';
import { FormFieldWrapper } from '@/components/ui/form-fields/FormFieldWrapper';
import { TextEditor } from '@/components/admin/TextEditor';
import { ProductLabelsEditor } from '@/components/admin/ProductLabelsEditor';
import currency from 'currency.js';
import { YupUtil } from '@/utils/yup.util';
import { generateRandomNumber } from '@/utils/order-number.util';

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
  refreshCallback,
}: ProductEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [selectedImages, setSelectedImages] = useState<StorageReference[]>();
  const [labels, setLabels] = useState<ILabel[]>();
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.ProductEditorFormSchema),
  });

  const submitForm = async (formData: {
    title?: string;
    price?: string;
    description?: string;
    categoryId?: string;
    images?: StorageReference[];
    labels?: ILabel[];
  }) => {
    setIsLoading(true);

    const imageUrls: string[] = formData.images.map((img) =>
      getStorageImageSrc(img)
    );
    const productData: IProduct = {
      id: selectedProduct ? selectedProduct.id : uuidv4(),
      title: formData.title,
      price: Number(currency(formData.price).toString()),
      description: formData.description,
      categoryRef: doc(
        db,
        FirestoreCollections.CATEGORIES,
        formData.categoryId
      ),
      imageUrls: imageUrls,
      labels: formData.labels,
      vendorCode:
        selectedProduct?.vendorCode || String(generateRandomNumber(9)),
      createDate: selectedProduct?.createDate || +new Date(),
    };
    const categoryData: ICategory = selectedProduct
      ? null
      : {
          ...selectedCategory,
          productsTotal: selectedCategory.productsTotal + 1,
        };

    try {
      await Promise.all([
        setDoc(
          doc(db, FirestoreCollections.PRODUCTS, productData.id),
          productData
        ),
        selectedProduct
          ? Promise.resolve()
          : setDoc(
              doc(db, FirestoreCollections.CATEGORIES, categoryData.id),
              categoryData
            ),
      ]);

      dispatch(
        setNotificationMessage(
          selectedProduct
            ? TRANSLATES[LOCALE].infoUpdated
            : TRANSLATES[LOCALE].productAdded
        )
      );
      setSelectedImages(null);
      setSelectedCategory(null);
      setSelectedProduct(null);
      setLabels(null);
      setDescription('');
      reset();
      refreshCallback?.();
    } catch (e) {
      console.error('Update product error: ', e);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const deleteProduct = async (deletedProduct: IProduct) => {
    setIsLoading(true);

    try {
      await deleteDoc(
        doc(db, FirestoreCollections.PRODUCTS, deletedProduct.id)
      );
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].productDeleted));
      changeProduct(undefined);
      reset();
      refreshCallback?.();
    } catch (e) {
      console.error('Delete product error: ', e);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const changeProduct = (newProduct: IProduct) => {
    if (newProduct) {
      const productCategory = categories.find(
        (category) => category.id === newProduct.categoryRef.id
      );
      const productImages: StorageReference[] =
        images?.filter((img) => {
          return newProduct.imageUrls?.find((productImg) =>
            productImg.includes(img.name)
          );
        }) || [];

      setValue('title', newProduct.title);
      setValue('price', String(newProduct.price));
      setValue('description', newProduct.description);
      setValue('categoryId', newProduct.categoryRef.id);
      setValue('images', productImages);
      setValue('labels', newProduct.labels || []);

      setDescription(newProduct.description);
      setSelectedCategory(productCategory);
      setSelectedImages(productImages);
      setLabels(newProduct.labels || []);
    } else {
      setValue('title', '');
      setValue('price', '');
      setValue('description', '');
      setValue('categoryId', '');
      setValue('images', []);
      setValue('labels', []);

      setDescription('');
      setSelectedCategory(undefined);
      setSelectedImages(undefined);
      setLabels(undefined);
    }
    setSelectedProduct(newProduct);
  };

  const changeImage = (newImages: StorageReference[]) => {
    setSelectedImages(newImages);
    setValue(`images`, newImages);
  };
  const changeCategory = (newCategory: ICategory) => {
    setValue('categoryId', newCategory?.id || '');
    setSelectedCategory(newCategory);
  };
  const changeDescription = (newValue: string) => {
    setValue('description', newValue);
    setDescription(newValue);
  };
  const changeLabels = (newLabels: ILabel[]) => {
    setValue('labels', newLabels);
    setLabels(newLabels);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submitForm)}>
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
          onChange={changeDescription}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label={TRANSLATES[LOCALE].label}
        error={errors.categoryId?.message}
      >
        <ProductLabelsEditor value={labels} onChange={changeLabels} />
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
          type={ButtonTypes.SUBMIT}
        >
          {TRANSLATES[LOCALE].save}
        </Button>
      </div>
    </form>
  );
}
