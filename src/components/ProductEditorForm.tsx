import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { CategoriesViewer } from '@/components/CategoriesViewer';
import { Category, Product } from '@/app/models';
import { StorageReference } from '@firebase/storage';
import { ImagesViewer } from '@/components/ImagesViewer';
import { getStorageImageSrc } from '@/utils/firebase.util';
import { ProductsViewer } from '@/components/ProductsViewer';

const validationSchema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required(),
  categoryId: yup.string().required(),
  imageUrls: yup.array().required()
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
                                    refreshData,
                                  }: ProductEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedImages, setSelectedImages] = useState<StorageReference[] | null>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { title: string, price: number, categoryId: string, imageUrls: string[] }) => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const changeImage = (newImages: StorageReference[]) => {
    setSelectedImages(newImages);
    setValue(
      'imageUrls',
      newImages
        ? newImages.map((img) => getStorageImageSrc(img))
        : []);
  };

  const changeCategory = (newCategory: Category | undefined) => {
    setValue('categoryId', newCategory?.id || '');
    setSelectedCategory(newCategory);
  };

  const changeProduct = (newProduct: Product | undefined) => {
    if (newProduct) {
      setValue('title', newProduct.title);
      // setValue('imageUrls', newProduct.imageUrl);
    } else {
      setValue('title', '');
      setValue('imageUrls', []);
    }
    setSelectedProduct(newProduct);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
    >
      <ProductsViewer
        selectedProduct={selectedProduct}
        firestoreProducts={firestoreProducts}
        selectProductClick={changeProduct}
      />

      <label className="mb-4">
        <span className="mr-2">{TRANSLATES[LOCALE].title}</span>
        <input
          className={inputClass}
          type="text"
          {...register('title')}
        />
      </label>
      <label className="mb-4">
        <span className="mr-2">{TRANSLATES[LOCALE].price}</span>
        <input
          className={inputClass}
          type="text"
          {...register('price')}
        />
      </label>

      <CategoriesViewer firestoreCategories={firestoreCategories} selectCategoryClick={changeCategory}/>
      <ImagesViewer multiple={true} storageData={storageData} selectImageClick={changeImage}/>

      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  );
}