import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ImagesViewer } from '@/components/ImagesViewer';
import { StorageReference } from '@firebase/storage';
import { IFirebaseGeneralEditorInfo } from '@/components/GeneralEditorForm';

const validationSchema = yup.object().shape({
  // image: yup.string().required(),
  title: yup.string().required(),
});

interface CategoryEditorFormProps {
  firebaseData: IFirebaseGeneralEditorInfo;
  storageData?: StorageReference[];
  refreshData?: () => void;
}

export function CategoryEditorForm({ storageData, refreshData }: CategoryEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { title: string }) => {
    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >

      <label className="mb-4">
        <span className="mr-2">{TRANSLATES[LOCALE].title}</span>
        <input
          className={inputClass}
          type="text"
          {...register('title')}
        />
      </label>

      <ImagesViewer storageData={storageData} selectImageClick={() => {}}/>

      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  )
}