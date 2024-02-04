import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useEffect, useState } from 'react';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { IFirestoreConfigEditorInfo } from '@/app/models';
import { FormField } from '@/components/form-fields/FormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';

const validationSchema = yup.object().shape({
  phone: yup.string().required('fieldRequired'),
  workingHours: yup.string().required('fieldRequired'),
  currency: yup.string().required('fieldRequired'),
  shopDescription: yup.string().required('fieldRequired')
});

interface GeneralEditorFormProps {
  firebaseData: IFirestoreConfigEditorInfo;
  refreshData?: () => void;
}

export function GeneralEditorForm({firebaseData, refreshData}: GeneralEditorFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (firebaseData) {
      setValue('phone', firebaseData.contactPhone?.stringValue);
      setValue('workingHours', firebaseData.workingHours?.stringValue);
      setValue('currency', firebaseData.currency?.stringValue);
      setValue('shopDescription', firebaseData.shopDescription?.stringValue);
    }
  }, [firebaseData]);

  const submitForm = async (formData: {
    phone: string,
    workingHours: string,
    currency: string,
    shopDescription: string
  }) => {
    setIsLoading(true);
    const data: WithFieldValue<DocumentData> = {
      contactPhone: formData.phone,
      workingHours: formData.workingHours,
      currency: formData.currency,
      shopDescription: formData.shopDescription
    };
    try {
      await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.CONFIG), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
      refreshData?.();
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <PhoneFormField
        label={TRANSLATES[LOCALE].phone}
        name="phone"
        type="text"
        error={errors.phone?.message}
        register={register}
      />
      <FormField
        label={TRANSLATES[LOCALE].currency}
        name="currency"
        type="text"
        error={errors.currency?.message}
        register={register}
      />
      <FormField
        label={TRANSLATES[LOCALE].workingHours}
        name="workingHours"
        type="text"
        error={errors.workingHours?.message}
        register={register}
      />
      <FormField
        label={TRANSLATES[LOCALE].mainShopInfo}
        name="shopDescription"
        type="text"
        error={errors.shopDescription?.message}
        register={register}
      />
      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  );
}