import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { CategoriesViewer } from '@/components/CategoriesViewer';
import { Category, Product } from '@/app/models';
import { StorageReference } from '@firebase/storage';
import { ImagesViewer } from '@/components/ImagesViewer';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { ProductsViewer } from '@/components/ProductsViewer';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { uuidv4 } from '@firebase/util';
import { db } from '@/utils/firebaseModule';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';

const validationSchema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required(),
  categoryId: yup.string().required(),
  images: yup.array().required(),
});

export interface ProductEditorFormProps {
  firestoreCategories: Category[];
  firestoreProducts: Product[];
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function ProductEditorForm({
                                    firestoreCategories,
                                    firestoreProducts,
                                    storageData,
                                    refreshData
                                  }: ProductEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
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

  const submitForm = async (formData: { title: string, price: number, categoryId: string, images: StorageReference[] }) => {
    setIsLoading(true);

    let data: WithFieldValue<DocumentData>;

    const imageUrls: string[] = formData.images.map((img) => (getStorageImageSrc(img)));

    if (selectedProduct) {
      data = {
        data: firestoreProducts.map((product: Product) => {
          return product.id === selectedProduct.id ? {
            id: uuidv4(),
            title: formData.title,
            price: formData.price,
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
            categoryId: formData.categoryId,
            imageUrls: imageUrls,
          }
        ]
      };
    }

    try {
      await setDoc(doc(db, FIREBASE_DATABASE_NAME, FirebaseCollections.PRODUCTS), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
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

  const changeImage = (newImages: StorageReference[]) => {
    setSelectedImages(newImages);
    setValue(`images`, newImages);
  };

  const changeCategory = (newCategory: Category | undefined) => {
    setValue('categoryId', newCategory?.id || '');
    setSelectedCategory(newCategory);
  };

  const changeProduct = (newProduct: Product | undefined) => {
    if (newProduct) {
      const productCategory = firestoreCategories.find((category) => category.id === newProduct.categoryId);
      const productImages: StorageReference[] = storageData?.filter((img) => {
        return newProduct.imageUrls?.find((productImg) => productImg.includes(img.name));
      }) || [];

      setValue('title', newProduct.title);
      setValue('price', newProduct.price);
      setValue('categoryId', newProduct.categoryId);
      setValue('images', productImages);

      setSelectedCategory(productCategory);
      setSelectedImages(productImages);
      // setValue('imageUrls', newProduct.imageUrl);
    } else {
      setValue('title', '');
      setValue('price', 0);
      setValue('images', []);
      setValue('categoryId', '');

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
      <ProductsViewer
        selectedProduct={selectedProduct}
        firestoreProducts={firestoreProducts}
        selectProductClick={changeProduct}
      />

      <label className="mt-2">
        <span className="mr-2">{TRANSLATES[LOCALE].title}</span>
        <input
          className={inputClass}
          type="text"
          {...register('title')}
        />
      </label>
      <label className="mt-2">
        <span className="mr-2">{TRANSLATES[LOCALE].price}</span>
        <input
          className={inputClass}
          type="text"
          {...register('price')}
        />
      </label>
      <div className="mt-2">
        <CategoriesViewer
          firestoreCategories={firestoreCategories}
          selectedCategory={selectedCategory}
          selectCategoryClick={changeCategory}
        />
      </div>
      <div className="mt-2">
        <ImagesViewer
          multiple={true}
          storageData={storageData}
          selectedImages={selectedImages}
          selectImageClick={changeImage}
        />
      </div>

      <Button
        styleClass="text-amber-50 w-full py-2 mt-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  );
}