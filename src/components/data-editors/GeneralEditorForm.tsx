import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useEffect, useState } from 'react';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { IConfig } from '@/app/models';
import { InputFormField } from '@/components/form-fields/InputFormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';
import { db } from '@/app/lib/firebase-config';
import { TextareaFormField } from '@/components/form-fields/TextareaFormField';

const validationSchema = yup.object().shape({
  phone: yup.string().required('fieldRequired'),
  workingHours: yup.string().required('fieldRequired'),
  currency: yup.string().required('fieldRequired'),
  shopDescription: yup.string().required('fieldRequired'),
  deliveryDescription: yup.string().required('fieldRequired')
});

interface GeneralEditorFormProps {
  firebaseData: IConfig;
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
      setValue('phone', firebaseData.contactPhone);
      setValue('workingHours', firebaseData.workingHours);
      setValue('currency', firebaseData.currency);
      setValue('shopDescription', firebaseData.shopDescription);
      setValue('deliveryDescription', firebaseData.deliveryDescription);
    }
  }, [firebaseData]);

  const submitForm = async (formData: {
    phone: string,
    workingHours: string,
    currency: string,
    shopDescription: string,
    deliveryDescription: string,
  }) => {
    setIsLoading(true);
    const data: WithFieldValue<DocumentData> = {
      contactPhone: formData.phone,
      workingHours: formData.workingHours,
      currency: formData.currency,
      shopDescription: formData.shopDescription,
      deliveryDescription: formData.deliveryDescription,
      nextOrderNumber: firebaseData.nextOrderNumber || 1
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
      <InputFormField
        placeholder={TRANSLATES[LOCALE].enterCurrency}
        label={TRANSLATES[LOCALE].currency}
        name="currency"
        type="text"
        error={errors.currency?.message}
        register={register}
      />
      <InputFormField
        placeholder={TRANSLATES[LOCALE].enterWorkingHours}
        label={TRANSLATES[LOCALE].workingHours}
        name="workingHours"
        type="text"
        error={errors.workingHours?.message}
        register={register}
      />
      <TextareaFormField
        placeholder={TRANSLATES[LOCALE].enterMainShopInfo}
        label={TRANSLATES[LOCALE].mainShopInfo}
        name="shopDescription"
        error={errors.shopDescription?.message}
        register={register}
      />
      <TextareaFormField
        placeholder={TRANSLATES[LOCALE].addDeliveryDescription}
        label={TRANSLATES[LOCALE].deliveryDescription}
        name="deliveryDescription"
        error={errors.deliveryDescription?.message}
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