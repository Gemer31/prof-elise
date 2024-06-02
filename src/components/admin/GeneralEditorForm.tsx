import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { useEffect, useState } from 'react';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';
import { IConfig } from '@/app/models';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { db } from '@/app/lib/firebase-config';
import { FormFieldWrapper } from '@/components/ui/form-fields/FormFieldWrapper';
import 'react-quill/dist/quill.snow.css';
import { TextEditor } from '@/components/admin/TextEditor';
import { YupUtil } from '@/utils/yup.util';

interface GeneralEditorFormProps {
  config: IConfig;
  refreshCallback?: () => void;
}

export function GeneralEditorForm({config, refreshCallback}: GeneralEditorFormProps) {
  const dispatch = useAppDispatch();
  const [shopDescription, setShopDescription] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [shopRegistrationDescription, setShopRegistrationDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.GeneralEditorFormSchema)
  });

  useEffect(() => {
    if (config) {
      setValue('phone', config.contactPhone);
      setValue('workingHours', config.workingHours);
      setValue('currency', config.currency);
      setValue('shopDescription', config.shopDescription);
      setValue('deliveryDescription', config.deliveryDescription);
      setShopDescription(config.shopDescription);
      setDeliveryDescription(config.deliveryDescription);
      setShopRegistrationDescription(config.shopRegistrationDescription);
    }
  }, [config]);

  const submitForm = async (formData: {
    phone?: string,
    workingHours?: string,
    currency?: string,
    shopDescription?: string,
    deliveryDescription?: string,
    shopRegistrationDescription?: string,
  }) => {
    setIsLoading(true);
    const data: WithFieldValue<DocumentData> = {
      contactPhone: formData.phone,
      workingHours: formData.workingHours,
      currency: formData.currency,
      shopDescription: formData.shopDescription,
      deliveryDescription: formData.deliveryDescription,
      shopRegistrationDescription: formData.shopRegistrationDescription,
    };
    try {
      await setDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
      refreshCallback?.();
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    } finally {
      setIsLoading(false);
    }
  };

  const deliveryDescriptionChange = (newValue: string) => {
    setValue('deliveryDescription', newValue);
    setDeliveryDescription(newValue);
  }
  const shopRegistrationDescriptionChange = (newValue: string) => {
    setValue('shopRegistrationDescription', newValue);
    setShopRegistrationDescription(newValue);
  }
  const shopDescriptionChange = (newValue: string) => {
    setValue('shopDescription', newValue);
    setShopDescription(newValue);
  }

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
      <FormFieldWrapper
        label={TRANSLATES[LOCALE].mainShopInfo}
        required={true}
        error={errors.shopDescription?.message}
      >
        <TextEditor
          placeholder={TRANSLATES[LOCALE].enterMainShopInfo}
          value={shopDescription}
          onChange={shopDescriptionChange}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label={TRANSLATES[LOCALE].deliveryDescription}
        required={true}
        error={errors.deliveryDescription?.message}
      >
        <TextEditor
          placeholder={TRANSLATES[LOCALE].addDeliveryDescription}
          value={deliveryDescription}
          onChange={deliveryDescriptionChange}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label={TRANSLATES[LOCALE].shopRegistrationDescription}
        required={true}
        error={errors.shopRegistrationDescription?.message}
      >
        <TextEditor
          placeholder={TRANSLATES[LOCALE].addShopRegistrationDescription}
          value={shopRegistrationDescription}
          onChange={shopRegistrationDescriptionChange}
        />
      </FormFieldWrapper>
      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonTypes.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  );
}